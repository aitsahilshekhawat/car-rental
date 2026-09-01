import { Routes, Route } from "react-router-dom";
import {
  About, AddCar, BecomeHost, Booking, CarDetails, Cars, CompareCars, Contact, Dashboard,
  EditCar, Favorites, ForgotPassword, HelpCenter, Home, HostApplications, HostDashboard,
  Login, ManageUsers, MyBookings, NotFound, PaymentHistory, PaymentReceipt, PrivacyPolicy,
  Profile, RazorpayCheckout, Register, ResetPassword, Terms, UserDashboard,
} from "./pages";

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/cars" element={<Cars />} />
    <Route path="/cars/:id" element={<CarDetails />} />
    <Route path="/compare" element={<CompareCars />} />
    <Route path="/booking" element={<Booking />} />
    <Route path="/checkout" element={<RazorpayCheckout />} />
    <Route path="/become-host" element={<BecomeHost />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/help-center" element={<HelpCenter />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token?" element={<ResetPassword />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/user-dashboard" element={<UserDashboard />} />
    <Route path="/host-dashboard" element={<HostDashboard />} />
    <Route path="/my-bookings" element={<MyBookings />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/payment-history" element={<PaymentHistory />} />
    <Route path="/payment-receipt" element={<PaymentReceipt />} />
    <Route path="/add-car" element={<AddCar />} />
    <Route path="/edit-car/:id" element={<EditCar />} />
    <Route path="/host-applications" element={<HostApplications />} />
    <Route path="/manage-users" element={<ManageUsers />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
