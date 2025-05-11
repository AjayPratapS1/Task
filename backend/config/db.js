import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(console.log("Db connection established"))
    .catch((error) => {
      console.log("Db connnction unsuccessful");
      console.error(error);
      process.exit(1);
    });
};
