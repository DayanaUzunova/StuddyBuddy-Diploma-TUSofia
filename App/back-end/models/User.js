const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  lang: { type: String, default: 'en' },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student", required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
