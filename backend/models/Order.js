const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      customizations: [
        {
          name: String, // e.g. "Size"
          choice: String, // e.g. "Large"
          priceModifier: Number,
        },
      ],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  deliveryType: {
    type: String,
    enum: ['Delivery', 'Pickup'],
    default: 'Delivery',
  },
  deliveryAddress: {
    street: String,
    city: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    default: 'Card',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
