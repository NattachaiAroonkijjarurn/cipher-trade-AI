import mongoose from "mongoose";

// Create User schema
const User = mongoose.model('account_users', {
    user_id: String,
    username: String,
    email: String,
    password: String,
    role: String,
    isEmailVerified: Boolean
  });

export { User }