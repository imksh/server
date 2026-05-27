import axios from "axios";

export const getGitHubStreak = async (req, res) => {
  try {
    const { username } = req.params;

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      "https://api.github.com/graphql",
      {
        query,
        variables: {
          login: username,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );

    const calendar =
      response.data.data.user.contributionsCollection.contributionCalendar;

    const weeks = calendar.weeks;

    const days = weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );

    let streak = 0;

    const activeDates = new Set(
      days.filter((d) => d.count > 0).map((d) => d.date),
    );

    // local date formatter
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    let current = new Date();

    // check today first
    let currentDateString = formatDate(current);

    // if no contribution today,
    // start from yesterday
    if (!activeDates.has(currentDateString)) {
      current.setDate(current.getDate() - 1);
    }

    while (true) {
      currentDateString = formatDate(current);

      if (activeDates.has(currentDateString)) {
        streak++;

        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    res.json({
      username,
      streak,
      totalContributions: calendar.totalContributions,
      days,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    res.status(500).json({
      error: "Failed to fetch GitHub data",
    });
  }
};

export const getLeetCodeStreak = async (req, res) => {
  try {
    const { username } = req.params;

    const query = `
      query userProfileCalendar($username: String!) {

        matchedUser(username: $username) {

          username

          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }

          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }

          profile {
            ranking
            reputation
            starRating
            userAvatar
          }

          contestBadge {
            name
          }
        }

        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          topPercentage
        }
      }
    `;

    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: {
        username,
      },
    });

    const user = response.data?.data?.matchedUser;

    const contest = response.data?.data?.userContestRanking;

    if (!user) {
      return res.status(404).json({
        error: "LeetCode user not found",
      });
    }

    const calendar = user.userCalendar;

    // parse calendar
    const parsedCalendar = JSON.parse(calendar.submissionCalendar || "{}");

    // contribution map
    const contributionMap = {};

    Object.entries(parsedCalendar).forEach(([timestamp, count]) => {
      const date = new Date(Number(timestamp) * 1000);

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      contributionMap[formattedDate] = count;
    });

    // generate last 365 days
    const days = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      days.push({
        date: formattedDate,
        count: contributionMap[formattedDate] || 0,
      });
    }

    // solved stats
    const solved = user.submitStats?.acSubmissionNum || [];

    const totalSolved = solved.find((s) => s.difficulty === "All")?.count || 0;

    const easySolved = solved.find((s) => s.difficulty === "Easy")?.count || 0;

    const mediumSolved =
      solved.find((s) => s.difficulty === "Medium")?.count || 0;

    const hardSolved = solved.find((s) => s.difficulty === "Hard")?.count || 0;

    const leetCodeStats = {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking: user.profile?.ranking || null,

      reputation: user.profile?.reputation || 0,

      starRating: user.profile?.starRating || 0,

      avatar: user.profile?.userAvatar || null,

      badge: user.contestBadge?.name || null,
      contestRating: contest?.rating || 0,

      globalRanking: contest?.globalRanking || 0,

      topPercentage: contest?.topPercentage || 0,

      attendedContests: contest?.attendedContestsCount || 0,
      totalActiveDays: calendar.totalActiveDays || 0,
    };

    console.log("LeetCode Stats:", leetCodeStats);

    res.json({
      username: user.username,

      // streaks
      streak: calendar.streak || 0,

      // contribution graph
      totalContributions: Object.values(contributionMap).reduce(
        (a, b) => a + b,
        0,
      ),

      days,
      leetCodeStats: leetCodeStats,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    res.status(500).json({
      error: "Failed to fetch LeetCode data",
    });
  }
};
