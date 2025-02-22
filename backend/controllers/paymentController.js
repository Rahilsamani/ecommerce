const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const ErrorHandler = require("../utils/errorHandler");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Process Payment
exports.processPayment = asyncErrorHandler(async (req, res, next) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,
    currency: currency || "INR",
    receipt: `receipt_${Math.floor(Math.random() * 1000000)}`,
    payment_capture: 1,
  };

  try {
    const payment = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order: payment,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Razorpay Callback
exports.razorpayResponse = asyncErrorHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature !== razorpay_signature) {
    return next(new ErrorHandler("Invalid Payment Signature", 400));
  }

  const paymentData = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    status: "Success",
  };

  try {
    await Payment.create(paymentData);
    res.status(200).json({
      success: true,
      message: "Payment Successful",
      paymentData,
    });
  } catch (error) {
    return next(new ErrorHandler("Payment Failed", 500));
  }
});

// Get Payment Status
exports.getPaymentStatus = asyncErrorHandler(async (req, res, next) => {
  const payment = await Payment.findOne({ orderId: req.params.id });

  if (!payment) {
    return next(new ErrorHandler("Payment Details Not Found", 404));
  }

  res.status(200).json({
    success: true,
    payment,
  });
});
