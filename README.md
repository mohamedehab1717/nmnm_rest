# nmnm | Luxury Restaurant Platform

A sophisticated digital storefront, online ordering system, and table reservation platform built for "nmnm" restaurant with a premium dark and violet purple theme.

## Tech Stack
- **Frontend**: React (Vite), Lucide Icons, Premium Custom Vanilla CSS (Design system with variables, glow filters, glassmorphism layers).
- **Backend**: Node.js, Express, JWT Authentication, Mongoose.
- **Database**: MongoDB.

## Features
- **Landing Page**: Immersive animations, luxury testimonials, operational hours, contact locations, and table booking reservation form.
- **Menu Categorization**: Browse Burgers, Pasta, Sandwiches, Sweets, Beverages, Juices, and Pizza. Search, filter, and item customization modal.
- **Persistent Cart System**: Increments quantity on matching customization combinations.
- **Dummy Checkout System**: Real-time total calculation based on delivery choice, capturing contact numbers, addresses, and mockup card processing.
- **Order Tracking**: Visual status tracker showing live preparation stages: `Pending` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Completed`.
- **Administrative Portal**:
  - Live Order Monitor: Track order queues, change state, filter.
  - Menu CRUD Manager: Publish, update details, toggle availability, delete dishes.
  - Booking Manager: Confirm or cancel guest reservation seats.

---

## Default Admin Credentials
- **Email**: `admin@nmnm.com`
- **Password**: `adminpassword123`
- **Staff Access Code** (required for Staff Portal login): `nmnm-staff-2026`

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017/nmnm`

### 1. Launch Backend
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 2. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be hosted on `http://localhost:5173`.
