//? The working of tokens is added at the end

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Please enter a username"],        // This means it is reqired, if not provided, return message "enter a username"
    unique: [true, "This username is already taken"]    // This means the email must be unique, if not provided, return message "email already exists"
  },
  email: { 
    type: String,  
    required: [true, "Please enter an email"],          // This means it is reqired, if not provided, return message "enter an email"
    unique: [true, "This email is already taken"]       // This means the email must be unique
  },
  password: { 
    type: String, 
    required: [true, "Please enter a password"]         // This means it is reqired, if not provided, return message "enter a password"
  },
  isVerified: { 
    type: Boolean, 
    default: false
  },
  isAdmin: { 
    type: Boolean, 
    default: false
  },
  forgotPasswordToken: {
    type: String
  },
  forgotPasswordTokenExpiry: {
    type: Date
  },
  verifyToken: {
    type: String
  },
  verifyTokenExpiry: {
    type: Date
  }
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);       // remember it is mongoose.models.Users not model

export default Users;

//? We have added verifyToken and forgotPasswordToken with their respective expiry for the user

//? When the user logs in for the first time, we send a verification email, which has the verifyToken. 
//? Also, we store the verifyToken and expiry for this token in the DataBase. 
//? When the user opens the link for the first time, a request is sent to the DB to match with the token.
//? If the token matches a user's verifyToken and is not expired, the user's isVerified is set to true.

//? The forgotPasswordToken also works in the same way as the verifyToken