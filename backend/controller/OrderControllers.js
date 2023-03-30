// const Order = require("../models/orderModel");
// const productModel = require("../models/productModelModel");
// const Errorhandler = require("../utils/Errorhandler");
// const catchAsync = require("../middleware/catchAsync");

import Order from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import Errorhandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAyscError.js";

// Create new Order
export const newOrder = catchAsync(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
export const getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new Errorhandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
export const myOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
export const updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new Errorhandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);

  productModel.Stock -= quantity;

  await productModel.save({ validateBeforeSave: false });
}

// delete Order -- Admin
export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
