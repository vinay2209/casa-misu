const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { protect } = require('../middleware/auth');

dotenv.config();

// nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.acceptingOrders === false) {
      return res.status(503).json({ success: false, message: 'We are not currently accepting orders. Please check back soon.' });
    }

    const { customerName, customerPhone, customerEmail, items, quantity, specialRequests, totalAmount, deliveryType, address, deliveryDate, deliveryTimeSlot, orderType, transactionId, paymentMethod, deliveryFee, deliveryPincode, razorpayOrderId, razorpayPaymentId, paymentStatus } = req.body;
    const order = new Order({
      customerName,
      customerPhone,
      customerEmail,
      items,
      quantity,
      specialRequests,
      totalAmount,
      deliveryType,
      address,
      deliveryDate: deliveryDate || undefined,
      deliveryTimeSlot,
      orderType,
      transactionId,
      paymentMethod,
      deliveryFee,
      deliveryPincode,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus,
    });
    const saved = await order.save();

    // send email to owner
    const scheduleText = orderType === 'scheduled'
      ? `Scheduled: ${deliveryDate || 'N/A'} — ${deliveryTimeSlot || 'N/A'}`
      : 'Scheduled: ASAP (min. 24hrs notice)';
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `New Casa Misu Order from ${customerName}`,
      text: `Name: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail || 'N/A'}\nItems: ${items}\nQuantity: ${quantity || 'N/A'}\nDelivery: ${deliveryType || 'pickup'}${address ? `\nAddress: ${address}` : ''}${deliveryFee ? `\nDelivery Fee: ₹${deliveryFee}` : ''}\n${scheduleText}\nTotal: ₹${totalAmount || 'N/A'}\nPayment Method: ${paymentMethod || 'UPI'}\nTransaction ID: ${transactionId || 'N/A'}\nSpecial Requests: ${specialRequests || 'None'}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      }
    });

    return res.json({ success: true, message: 'Order placed successfully', orderId: saved._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/orders (protected)
router.get('/', protect, async (req, res) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/orders/:id/status (protected)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/orders/:id/payment (protected)
router.patch('/:id/payment', protect, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = paymentStatus;
    await order.save();
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/orders/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
