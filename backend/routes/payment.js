const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const Settings = require('../models/Settings');
dotenv.config();

function getClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payment/create-order  { amount: <rupees> }
router.post('/create-order', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.acceptingOrders === false) {
      return res.status(503).json({ message: 'We are not currently accepting orders. Please check back soon.' });
    }
    const client = getClient();
    if (!client) {
      return res.status(503).json({ message: 'Payment gateway is not configured yet' });
    }
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const order = await client.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `casamisu_${Date.now()}`,
    });
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not start payment' });
  }
});

// POST /api/payment/verify  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Payment gateway is not configured yet' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const verified = expected === razorpay_signature;
    return res.json({ verified });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not verify payment' });
  }
});

module.exports = router;
