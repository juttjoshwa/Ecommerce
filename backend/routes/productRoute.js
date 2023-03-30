import express from "express";
import getAllproducts, {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReviews,
  GetProductDetails,
  getProductReviews,
  updateProduct,
} from "../controller/productController.js";
import { AuthorizeRoles, isAuthenticatedUser } from "../middleware/Auth.js";
// import getAllproducts from "../controller/productController";

const router = express.Router();
router.route("/products").get(getAllproducts);
router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, AuthorizeRoles("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, AuthorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, AuthorizeRoles("admin"), deleteProduct);
router.route("/products/:id").get(GetProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReviews);

export default router;
