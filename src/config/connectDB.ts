import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Connected to DB ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`
    );
  } catch (error) {
    console.log("Error in connectDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
