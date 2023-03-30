import  express  from "express";
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controller/OrderControllers.js";
const router = express.Router();

import { isAuthenticatedUser, AuthorizeRoles } from "../middleware/Auth.js";

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, AuthorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, AuthorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, AuthorizeRoles("admin"), deleteOrder);

  export default router;
