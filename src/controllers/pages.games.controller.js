import MatchGrid from "../models/matchGrid.model.js";

export const MatchGridStats = async (req, res) => {
  try {
    const game = await MatchGrid.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          games: 0,
          bestMove: 0,
          bestTime: 0,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json(game);
  } catch (error) {
    console.log("Error in MatchGrid:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const MatchGridStatsUpdate = async (req, res) => {
  try {
    const { games, bestMove, bestTime } = req.body;

    const updated = await MatchGrid.findOneAndUpdate(
      { user: req.user._id },
      { $set: { games, bestMove, bestTime } },
      { new: true, upsert: true },
    );

    res.status(200).json(updated);
  } catch (error) {
    console.log("Error in MatchGrid:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
