import jwt from "jsonwebtoken";

const generateToken = (user, req, res) => {
  const platform = req.headers["x-platform"];
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  if (platform === "web") {
    res.cookie("jwt", token, cookieOptions);
  }

  return token;
};

export default generateToken;
