const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const memoryDb = require('../models/memoryDb');

// Create order
router.post('/', protect, async (req, res) => {
  const { items, totalAmount, deliveryType, deliveryAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let createdOrder;
    if (isDbConnected) {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        deliveryType,
        deliveryAddress,
        paymentMethod,
        paymentStatus: 'Paid',
      });
      createdOrder = await order.save();
    } else {
      const orderId = 'o' + (memoryDb.orders.length + 1) + Math.floor(Math.random() * 1000);
      createdOrder = {
        _id: orderId,
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email
        },
        items,
        totalAmount,
        deliveryType,
        deliveryAddress,
        paymentMethod,
        paymentStatus: 'Paid',
        status: 'Pending',
        createdAt: new Date(),
      };
      memoryDb.orders.push(createdOrder);
    }

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json({ success: true, data: orders });
    } else {
      // Find orders matching user
      const userOrders = memoryDb.orders.filter(
        o => (o.user._id || o.user) === req.user._id
      ).sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, data: userOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const orders = await Order.find({})
        .populate('user', 'id name email')
        .sort({ createdAt: -1 });
      res.json({ success: true, count: orders.length, data: orders });
    } else {
      const sortedOrders = [...memoryDb.orders].sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, count: sortedOrders.length, data: sortedOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = status;
        const updatedOrder = await order.save();
        res.json({ success: true, data: updatedOrder });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    } else {
      const order = memoryDb.orders.find(o => o._id === req.params.id);
      if (order) {
        order.status = status;
        res.json({ success: true, data: order });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
