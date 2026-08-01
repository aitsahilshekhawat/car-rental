# 🚗 Car Rental System (MERN Stack)

A full-stack Car Rental Management System built using the MERN Stack. The application allows users to browse cars, book rentals, manage bookings, add favorites, write reviews, and provides an admin dashboard for managing cars and bookings.

---

## 🌐 Live Demo

### Frontend
https://car-rental-pied-pi.vercel.app/

### Backend API
https://car-rental-sywz.onrender.com

---

# Features

## User Features

- User Registration & Login (JWT Authentication)
- Browse Available Cars
- Search & Filter Cars
- View Car Details
- Book a Car
- View Booking History
- Cancel Booking
- Favorite Cars
- Review & Rating System
- Dark / Light Theme
- Responsive Design

---

## Admin Features

- Secure Admin Authentication
- Add New Cars
- Update Car Details
- Delete Cars
- View All Bookings
- Approve / Reject Bookings
- Complete Bookings
- Dashboard Analytics
    - Total Cars
    - Total Bookings
    - Total Revenue
    - Recent Bookings

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- BcryptJS
- Multer
- Cloudinary

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# Folder Structure

```
car-rental/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/aitsahilshekhawat/car-rental.git

cd car-rental
```

---

## Backend Setup

```bash
cd server

npm install
```

Create `.env`

```env
PORT=3000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

Start Backend

```bash
npm run server
```

---

## Frontend Setup

```bash
cd client

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

Start Frontend

```bash
npm run dev
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

---

## Cars

```
GET /api/cars

GET /api/cars/:id

POST /api/cars/add

PUT /api/cars/:id

DELETE /api/cars/:id
```

---

## Bookings

```
POST /api/bookings

GET /api/bookings/my

PUT /api/bookings/cancel/:id

GET /api/bookings

PUT /api/bookings/status/:id
```

---

## Favorites

```
POST /api/favorites

GET /api/favorites
```

---

## Reviews

```
POST /api/reviews

GET /api/reviews/:carId
```

---

## Dashboard

```
GET /api/dashboard

GET /api/user-dashboard
```

---

# Screenshots

## Home Page

> Add Screenshot

---

## Car Listing

> Add Screenshot

---

## Car Details

> Add Screenshot

---

## Booking Page

> Add Screenshot

---

## User Dashboard

> Add Screenshot

---

## Admin Dashboard

> Add Screenshot

---

# Future Improvements

- Stripe Payment Integration
- Email Notifications
- Booking Invoice PDF
- Admin Analytics Charts
- Google OAuth Login
- Car Availability Calendar
- Image Upload while Adding Cars
- Pagination
- Wishlist Notifications

---

# Author

**Sahil Shekhawat**

GitHub

https://github.com/aitsahilshekhawat

LinkedIn

https://www.linkedin.com/in/sahil-shekhawat-b5b08a295/

---

# License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, don't forget to Star the repository.
