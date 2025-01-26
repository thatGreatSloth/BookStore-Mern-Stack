//create different controller functions for the different routes
import bcrypt from "bcryptjs"; //encrypt password
import jwt from "jsonwebtoken"; //generate token for authentication
import userModel from "../models/userModel.js"; //import the user model

export const register = async (req, res) => {
  //to create  a new user, we need a name, email and password which are sent in the request body
  const { name, email, password } = req.body;

  //if fields is empty, return an error
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill in all fields" });
  }

  try {
    //try to create a new user and store it in the database

    //1. check for existing user via email id

    const existingUser = await userModel.findOne({ email }); //find a user with the email id

    //if the user exists, return an error
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });

      //hash the password if the user does not exist
      const hashedPassword = await bcrypt.hash(password, 10); //hash the password -> if we increase the value of 10, the password will be more secure but it will take more time to hash the password.
    }

    //create a new user
    const user = new userModel({ name, email, password: hashedPassword }); //create a new user with the name, email and hashed password

    //save the user in the database
    await user.save();

    //generate a token for the user using jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); //whenever a new user is created, a token is generated for the user

    //after creating the token, we have to send the token using the cookie
    //only http request can access the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //secure is false for a development environment and true for a production environment
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      //in development, the same site is strict and in production, the same site is none since in production, the frontend and backend are on different domains and we want to allow the cookie to be sent across different domains
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
    }); //send the token as a cookie
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
