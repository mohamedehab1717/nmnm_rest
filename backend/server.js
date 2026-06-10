const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const seedMenuItems = require('./data/seedMenuData');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));

// Base health route
app.get('/api', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    message: 'Welcome to the nmnm Luxury Restaurant API',
    databaseMode: isDbConnected ? 'MongoDB Live' : 'In-Memory Fallback Active'
  });
});

// MongoDB Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nmnm';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected successfully.');
    await seedDatabase();
    startServer();
  })
  .catch((err) => {
    console.warn('⚠️ WARNING: Local MongoDB connection failed. Falling back to memory database configuration.');
    console.warn('Reason:', err.message);
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    const isDbConnected = mongoose.connection.readyState === 1;
    console.log(`Mode: [${isDbConnected ? 'MongoDB live' : 'In-Memory Fallback'}]`);
  });
}

// Seeding initial menu items & an admin user
async function seedDatabase() {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'nmnm Executive Admin',
        email: 'admin@nmnm.com',
        password: 'adminpassword123',
        role: 'admin',
      });
      console.log('Admin account seeded: admin@nmnm.com / adminpassword123');
    }

    const menuCount = await MenuItem.countDocuments({});
    if (menuCount === 0) {
      await MenuItem.insertMany(seedMenuItems);
      console.log('Successfully seeded database with luxury menu items.');
    }
  } catch (error) {
    console.error('Error seeding database: ', error);
  }
}
