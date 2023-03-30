import express from "express";
import {
  DeleteUserProfile,
  forgotPassword,
  getAllUser,
  getsingleUserDetail,
  loginUser,
  LogoutUser,
  registerModel,
  resetPassword,
  UpdateUserPassword,
  UpdateUserProfile,
  updateUserRole,
  userDetails,
} from "../controller/userController.js";
// import  registerModel  from "../controller/userController.js"
import { AuthorizeRoles, isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(registerModel);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(LogoutUser);

router.route("/me").get(isAuthenticatedUser, userDetails);

router.route("/password/update").put(isAuthenticatedUser, UpdateUserPassword);

router.route("/me/update").put(isAuthenticatedUser, UpdateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, AuthorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, AuthorizeRoles("admin"), getsingleUserDetail)
  .put(isAuthenticatedUser, AuthorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, AuthorizeRoles("admin"), DeleteUserProfile);

export default router;














