import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please Enter your Name"],
    maxLenght: [30, "Name cannot exceed 30 characters"],
    minLenght: [4, "Name Should be more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLenght: [8, "Name Should be greater than 7 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

// JWT TOKKEN
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare Password

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", UserSchema);

export default User;
