import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAyscError.js";
import User from "../model/UserModel.js";
import sendTokken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import productModel from "../model/productModel.js";

export const registerModel = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Errorhandler("Email is already in use.", 400);
    }
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "this is sample Pic",
        url: "smaplePath",
      },
    });

    sendTokken(user, 201, res);

    // login user
  } catch (error) {
    // handle the error here
    next(new Errorhandler(`${error.name} : ${error.message}`, 400));
  }
});

// Login mehtod

export const loginUser = catchAsync(async (req, res, next) => {
  const {email, password } = req.body;
  // cheaking if user is given password and email both

  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new Errorhandler("Invaild Email or Password"), 401);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Errorhandler("Invaild Email or Password", 401));
  }

  sendTokken(user, 200, res);
});

// Logout method

export const LogoutUser = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Errorhandler(error.message, 500));
  }
});

//RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new Errorhandler(
        "Reset Password Tokken is Invaild or has been Expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Errorhandler("Password does not match", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokken(user, 200, res);
});

// Get user Details
export const userDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user password
export const UpdateUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new Errorhandler("old password incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new Errorhandler("Confirm Password Correctly", 400));
  }

  user.password = req.body.newPassword;

  await user.save();
  sendTokken(user, 200, res);
});

// Update user Profile
export const UpdateUserProfile = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//get all User to see as a admin
export const getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// if admin want to see someOne detail function get all user details for single user
export const getsingleUserDetail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });

  if (!user) {
    return next(
      new Errorhandler(`user dose not exist with this ID : ${req.params.id}`)
    );
  }
});

// Update normal user Profile  as a -- admin
export const updateUserRole = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user Profile --admin
export const DeleteUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Errorhandler(`User not exist with ID : ${req.params.id}`, 404)
    );
  }

  await user.remove();
  // we will remove cloudnary
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
