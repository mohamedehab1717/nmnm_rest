const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Burgers', 'Pasta', 'Sandwiches', 'Sweets', 'Beverages', 'Juices', 'Pizza'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  },
  customizations: [
    {
      name: String, // e.g. "Size", "Extra Cheese", "Gluten Free"
      options: [
        {
          name: String, // e.g. "Large", "Yes", "Double Patty"
          priceModifier: {
            type: Number,
            default: 0,
          },
        },
      ],
      required: {
        type: Boolean,
        default: false,
      },
      maxSelections: {
        type: Number,
        default: 1, // 1 for radio selection, higher for checkbox multi-select
      },
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
