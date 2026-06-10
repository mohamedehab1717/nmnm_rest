const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const { protect, admin } = require('../middleware/auth');
const memoryDb = require('../models/memoryDb');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const menuItems = await MenuItem.find({});
      res.json({ success: true, count: menuItems.length, data: menuItems });
    } else {
      res.json({ success: true, count: memoryDb.menuItems.length, data: memoryDb.menuItems });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findById(req.params.id);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      res.json({ success: true, data: menuItem });
    } else {
      const menuItem = memoryDb.menuItems.find(m => m._id === req.params.id);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      res.json({ success: true, data: menuItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create menu item
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, category, image, customizations } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        image,
        customizations: customizations || [],
      });
      const createdMenuItem = await menuItem.save();
      res.status(201).json({ success: true, data: createdMenuItem });
    } else {
      const newId = 'm' + (memoryDb.menuItems.length + 1);
      const menuItem = {
        _id: newId,
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
        customizations: customizations || [],
        isAvailable: true,
      };
      memoryDb.menuItems.push(menuItem);
      res.status(201).json({ success: true, data: menuItem });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update menu item
router.put('/:id', protect, admin, async (req, res) => {
  const { name, description, price, category, image, customizations, isAvailable } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findById(req.params.id);
      if (menuItem) {
        menuItem.name = name !== undefined ? name : menuItem.name;
        menuItem.description = description !== undefined ? description : menuItem.description;
        menuItem.price = price !== undefined ? price : menuItem.price;
        menuItem.category = category !== undefined ? category : menuItem.category;
        menuItem.image = image !== undefined ? image : menuItem.image;
        menuItem.customizations = customizations !== undefined ? customizations : menuItem.customizations;
        menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

        const updatedMenuItem = await menuItem.save();
        res.json({ success: true, data: updatedMenuItem });
      } else {
        res.status(404).json({ success: false, message: 'Menu item not found' });
      }
    } else {
      const index = memoryDb.menuItems.findIndex(m => m._id === req.params.id);
      if (index !== -1) {
        const item = memoryDb.menuItems[index];
        const updated = {
          ...item,
          name: name !== undefined ? name : item.name,
          description: description !== undefined ? description : item.description,
          price: price !== undefined ? parseFloat(price) : item.price,
          category: category !== undefined ? category : item.category,
          image: image !== undefined ? image : item.image,
          customizations: customizations !== undefined ? customizations : item.customizations,
          isAvailable: isAvailable !== undefined ? isAvailable : item.isAvailable,
        };
        memoryDb.menuItems[index] = updated;
        res.json({ success: true, data: updated });
      } else {
        res.status(404).json({ success: false, message: 'Menu item not found' });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete menu item
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findById(req.params.id);
      if (menuItem) {
        await MenuItem.deleteOne({ _id: req.params.id });
        res.json({ success: true, message: 'Menu item removed' });
      } else {
        res.status(404).json({ success: false, message: 'Menu item not found' });
      }
    } else {
      const index = memoryDb.menuItems.findIndex(m => m._id === req.params.id);
      if (index !== -1) {
        memoryDb.menuItems.splice(index, 1);
        res.json({ success: true, message: 'Menu item removed' });
      } else {
        res.status(404).json({ success: false, message: 'Menu item not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
