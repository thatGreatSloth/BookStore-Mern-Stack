//add function to connect to mongodb database

import mongoose from "mongoose";

mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
};

export default connectDB;