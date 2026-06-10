const bcrypt = require('bcryptjs');
const seedMenuItems = require('../data/seedMenuData');

const menuItems = seedMenuItems.map((item, index) => ({
  ...item,
  _id: `m${index + 1}`,
  isAvailable: true,
}));

const users = [
  {
    _id: 'u1',
    name: 'nmnm Executive Admin',
    email: 'admin@nmnm.com',
    passwordHash: bcrypt.hashSync('adminpassword123', 10),
    role: 'admin',
    createdAt: new Date(),
  },
];

const orders = [];
const reservations = [];

module.exports = {
  menuItems,
  users,
  orders,
  reservations,
};
