import productModel from "../model/productModel.js";
import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAyscError.js";
import ApiFeatures from "../utils/ApiFeatures.js";

// create product --Admin

export const createProduct = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const Product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    Product,
  });
});

// get all products
const getAllproducts = catchAsync(async (req, res) => {
  const resultperPage = 8;
  const productCount = await productModel.countDocuments();
  const apifeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultperPage);

  const Products = await apifeatures.query;
  res.status(200).json({
    success: true,
    Products,
    productCount,
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

export const createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all reviews of a single product
export const getProductReviews = catchAsync(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete reviews
export const deleteReviews = catchAsync(async (req, res, next) => {
  const Product = await productModel.findById(req.query.productId);
  if (!Product) {
    return next(new Errorhandler("Product not found", 404));
  }

  const reviews = Product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;

  const numofReviews = reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numofReviews,
    }, 
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

export default getAllproducts;
