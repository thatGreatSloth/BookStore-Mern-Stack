//create a user model to relate to the user collection in the database

import { verify } from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //define a structure of the user data
    name:{type: String, required: true}, //name is a string and is required
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    verifyOtp : {type: String, default: ''},
    verifyOtpExpireAt : {type: Number, default: 0},
    isAccountVerified : {type: Boolean, default: false},
    resetOtp : {type: String, default: ''},
    resetOtpExpireAt : {type: Number, default: 0},

});

//using the schema to create a model

//the model is searched for in the database and if it is not found, it is created
const userModel = mongoose.models.user || mongoose.model('User', userSchema);

export default userModel; //export the model to be used in other files