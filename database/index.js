import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionUrl = "mongodb://localhost:27017/blog";

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("Conected to MongoDB"))
    .catch((error) =>
      console.log("Error connecting to MongoDB:", error.message)
    );
};

export default connectToDB;
