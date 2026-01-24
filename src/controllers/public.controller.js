export const testQR = async (req, res, next) => {
  try {
    const { link } = req.query;
    if (link === "ricr") {
      return res.status(200).json({ redirect: "https://ricr.in/" });
    }
    res.status(200).json({ redirect: "https://www.facebook.com/" });
  } catch (error) {
    console.log("Error in Testing QR: ", error);
    next(error);
  }
};
