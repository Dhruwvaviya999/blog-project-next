import mongoose from "mongoose";
require("dotenv").config();

const connectToDB = async () => {
  const connectionUrl = process.env.MONGO_URI;

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("Conected to MongoDB"))
    .catch((error) =>
      console.log("Error connecting to MongoDB:", error.message)
    );
};

export default connectToDB;
