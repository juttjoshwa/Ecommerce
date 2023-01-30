import express from "express"
import {forgotPassword, loginUser, LogoutUser, registerModel,} from "../controller/userController.js";
// import  registerModel  from "../controller/userController.js"

const router = express.Router()

router.route("/register").post(registerModel);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword)

router.route("/logout").get(LogoutUser)

export default router; 