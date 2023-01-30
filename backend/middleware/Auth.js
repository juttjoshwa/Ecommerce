import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "./catchAyscError.js";
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

export const isAuthenticatedUser = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  // console.log(token)

  if (!token) {
    return next(new Errorhandler("Please Login to access this resource"), 401);
  }

  const decodejwtData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodejwtData.id);
  next();
});

// authorizeroles

export const AuthorizeRoles=(...roles)=>{

  return(req,res,next)=>{
     if(!roles.includes(req.user.role)){
      return next(
      new Errorhandler(`role : ${req.user.role} is not allowed to access this resource`,403)
      )
    }
    next()
  }

}
