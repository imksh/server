import mongoose from "mongoose";

const matchGridSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    games: {
      type: Number,
      default: 0,
    },
    bestTime: {
      type: Number,
      default: 0,
    },
    bestMove: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const MatchGrid = mongoose.model("MatchGrid", matchGridSchema);
export default MatchGrid;
