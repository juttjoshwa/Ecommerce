import productModel from "../model/productModel.js";
import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAyscError.js";
import ApiFeatures from "../utils/ApiFeatures.js";

// create product --Admin

export const createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id
  const Product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    Product,
  });
});

// get all products
const getAllproducts = catchAsync(async (req, res) => {
  const resultperPage = 5;
  const productCount = await productModel.countDocuments()
  const apifeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultperPage);

  const Products = await apifeatures.query;
  res.status(200).json({
    success: true,
    Products,
    productCount
  });
});
 
// update product --Admin
export const updateProduct = catchAsync(async (req, res, next) => {
  let Product = await productModel.findById(req.params.id);

  if (!Product) {
    return next(new Errorhandler("Product Not Found", 404));
  }

  Product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    Product,
  });
});

// delete Product
export const deleteProduct = catchAsync(async (req, res, next) => {
  const Product = await productModel.findById(req.params.id);

  if (!Product) {
    return next(new Errorhandler("Product Not Found to Delete"));
  }
  await Product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

// get Product details

export const GetProductDetails = catchAsync(async (req, res, next) => {
  const Product = await productModel.findById(req.params.id);

  if (!Product) {
    return next(new Errorhandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    Product,
  });
});

export default getAllproducts;
