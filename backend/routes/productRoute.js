import express from "express";
import getAllproducts, {
  createProduct,
  deleteProduct,
  GetProductDetails,
  updateProduct,
} from "../controller/productController.js";
import { AuthorizeRoles, isAuthenticatedUser } from "../middleware/Auth.js";
// import getAllproducts from "../controller/productController";

const router = express.Router();
router.route("/products").get(getAllproducts);
router
  .route("/products/new")
  .post(
    isAuthenticatedUser,
    AuthorizeRoles("admin"),
    isAuthenticatedUser,
    createProduct
  );
router
  .route("/products/:id")
  .put(isAuthenticatedUser,AuthorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser,AuthorizeRoles("admin") , deleteProduct)
  .get(GetProductDetails);

export default router;
