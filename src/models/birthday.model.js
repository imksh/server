import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    sender: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true },
);

const Birthday = mongoose.model("Birthday", birthdaySchema);
export default Birthday;
