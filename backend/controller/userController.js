import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAyscError.js";
import User from "../model/UserModel.js";
import sendTokken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import nodemailer from "nodemailer"

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
  const { email, password } = req.body;
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

// make this pice of code better ?
// forgot Password
// export const ForgotPassword = catchAsync(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new Errorhandler("User not found", 404));
//   }

//   // Get ResetPassword Token

//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   const resetPasswordUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/password/reset/${resetToken}`;

//   const message =`your password reset tokken is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;

//   try {
//     await sendEmail ({
//       email : user.email,
//       subject  : `Ecommers password Reset`,
//       message,
//     })
//     res.status(200).json({
//       success : true,
//       message : `email sent to ${user.email} successfully`
//     })
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new Errorhandler(error.message, 500));
//   }
// }); make alternate of this code

// 



// export const sendPasswordResetEmail = async (email, resetToken) => {

//   const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return next(new Errorhandler("User not found", 404));
//     }
//   try {
//     // Create a transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//       host: "gmail", // Your SMTP server host
//       port: 587, // SMTP port
//       secure: false, // Use TLS
//       auth: {
//         user: "juttjoshwa@gmail.com", // Your email address
//         pass: "2235 joshwa", // Your email password
//       },
//     });

//     // Compose the email message
//     const message = `You are receiving this email because you requested a password reset for your account.\n\n
//     Please use the following link to reset your password: \n\n
//     http://localhost:3000/reset/${resetToken}\n\n
//     If you did not request a password reset, please ignore this email.\n`;

//     // Send the email
//     const info = await transporter.sendMail({
//       from: "juttjoshwa@gmail.com",
//       to: user.email,
//       subject: "Password Reset Request",
//       text: message,
//     });

//     console.log("Email sent: %s", info.messageId);
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Failed to send password reset email to ${email}`);
//   }
// };

 // Example usage
 // sendPasswordResetEmail("recipient@example.com", "abcdefghijklmnopqrstuvwxyz");


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
