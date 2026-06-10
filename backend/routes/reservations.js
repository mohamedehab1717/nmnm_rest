const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const { protect, admin } = require('../middleware/auth');
const memoryDb = require('../models/memoryDb');

// Create new reservation
router.post('/', async (req, res) => {
  const { name, email, phone, date, time, guestsCount, specialRequests, userId } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let createdRes;
    if (isDbConnected) {
      const reservation = new Reservation({
        user: userId || null,
        name,
        email,
        phone,
        date,
        time,
        guestsCount,
        specialRequests,
      });
      createdRes = await reservation.save();
    } else {
      createdRes = {
        _id: 'r' + (memoryDb.reservations.length + 1) + Math.floor(Math.random() * 100),
        user: userId || null,
        name,
        email,
        phone,
        date,
        time,
        guestsCount: parseInt(guestsCount, 10),
        specialRequests,
        status: 'Pending',
        createdAt: new Date()
      };
      memoryDb.reservations.push(createdRes);
    }

    res.status(201).json({ success: true, data: createdRes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user reservations
router.get('/myreservations', protect, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json({ success: true, data: reservations });
    } else {
      const userRes = memoryDb.reservations.filter(
        r => r.user === req.user._id
      ).sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, data: userRes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all reservations (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservations = await Reservation.find({}).sort({ date: 1, time: 1 });
      res.json({ success: true, count: reservations.length, data: reservations });
    } else {
      const sorted = [...memoryDb.reservations].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
      res.json({ success: true, count: sorted.length, data: sorted });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update status (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservation = await Reservation.findById(req.params.id);
      if (reservation) {
        reservation.status = status;
        const updated = await reservation.save();
        res.json({ success: true, data: updated });
      } else {
        res.status(404).json({ success: false, message: 'Reservation not found' });
      }
    } else {
      const reservation = memoryDb.reservations.find(r => r._id === req.params.id);
      if (reservation) {
        reservation.status = status;
        res.json({ success: true, data: reservation });
      } else {
        res.status(404).json({ success: false, message: 'Reservation not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
