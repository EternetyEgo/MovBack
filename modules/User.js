const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userScheme);