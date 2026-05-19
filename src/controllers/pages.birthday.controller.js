import Birthday from "../models/birthday.model.js";
import { UploadMultipleToCloudinary } from "../utils/uploadMultipleToCloudinary.js";

export const addBirthday = async(req, res, next) => {
  try {
    const { name, date, message,sender } = req.body;
    const images = req.files;
    if (!name || !date || !sender) {
      return next({ status: 400, message: "Name and date are required" });

    }

    let uploads = [];

    if (images?.length > 0) {
      uploads = await UploadMultipleToCloudinary(images, "Pages/Birthday");
    }

    const birthday = new Birthday({
      name,
      date,
      sender,
      message,
      images: uploads,
    });

    await birthday.save();
    res.status(201).json(birthday);

  } catch (error) {
    console.log("Error in addBirthday: ", error);
    next(error);
  }
};



export  const getBirthday = async(req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Birthday.findById(id);
    res.status(200).json(data);
  } catch (error) {
    console.log("Error in getBirthday: ", error);
    next(error);
  }
};
