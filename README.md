
# 🚗 DriveOn - Full Stack Car Rental Platform

DriveOn is a modern, full-stack car rental and booking platform. It allows users to browse premium cars, book them for specific dates, and manage their trips. It also features a robust Role-Based Access Control (RBAC) system for Hosts, Managers, and Admins to manage the fleet and platform.

## 🚀 Tech Stack (Current: MERN)

**Frontend:**
- React (Vite)
- React Router DOM (Routing)
- Vanilla CSS (Modular, Custom CSS Variables)
- Lucide React (Icons)
- React Datepicker & Date-fns (Booking Calendars)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (NoSQL Database)
- JSON Web Tokens (JWT) & HttpOnly Cookies (Authentication)
- Cloudinary (Image Hosting)

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for `User`, `Host`, `Manager`, and `Admin`.
- **Dynamic Booking System:** Calculate prices dynamically based on rental days.
- **Calendar Conflict Prevention:** Server-side transaction handling to prevent double-booking of the same car on the same dates.
- **Custom Dashboards:** Real-time stats and booking management for users and hosts.
- **Secure Authentication:** JWT tokens stored securely in HttpOnly cookies to prevent XSS attacks.
- **Resource-Based Authorization:** Users and hosts can only edit or delete the resources (cars/bookings) they explicitly own.

## 🛠️ Local Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aitsahilshekhawat/car-rental.git
   cd car-rental
   ```

2. **Install Dependencies**
   Open two terminal windows/tabs.
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm install
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   cd client
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   # Add your Cloudinary/Payment gateway keys if applicable
   ```

4. **Run the Application**
   *Backend:*
   ```bash
   cd server
   npm start # or npm run dev
   ```
   
   *Frontend:*
   ```bash
   cd client
   npm run dev
   ```

## 🗺️ Roadmap & Future Architecture
*Currently, the `main` branch uses MongoDB. An architectural migration is planned to shift the database from MongoDB to **PostgreSQL** using **Prisma ORM** for stricter relational data integrity, better booking transaction handling, and type-safety.*
```

Is file ko save karne ke baad, aap isko GitHub par bhi push kar sakte ho taaki aapke profile par jo bhi repo dekhe, usko ek professional documentation mile:

```bash
git add README.md
git commit -m "Added project README"
git push origin main
```
