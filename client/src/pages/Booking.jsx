import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2, Mail, Phone, ShieldCheck } from "lucide-react";
import PageShell from "../components/Layout";
import { cars, currency } from "../data/cars";
import { carApi } from "../services/api";
import { getMember } from "../services/session";
import { Field, saveBooking } from "./shared";

export function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const carId = params.get("car");
  const staticCar = cars.find((item) => item.id === carId);
  const [dbCar, setDbCar] = useState(null);

  useEffect(() => {
    if (!staticCar && carId) {
      carApi.list().then(data => {
        const found = (data.cars || []).find(c => c._id === carId);
        if (found) setDbCar({
          id: found._id, name: found.name, brand: found.brand || found.name?.split(" ")[0] || "Unknown", type: found.type || "Premium",
          pricePerDay: found.pricePerDay, fuelType: found.fuelType || "Petrol", transmission: found.transmission || "Automatic",
          seatingCapacity: found.seatingCapacity || 5, location: found.location,
          rating: found.averageRating || 4.5, reviews: found.totalReviews || 0,
          image: found.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85",
        });
      }).catch(() => {});
    }
  }, [carId, staticCar]);

  const car = staticCar || dbCar || cars[0]; 
  const paid = params.get("paid") === "true";
  
  const days = parseInt(params.get("days") || "3", 10);
  const pickupRaw = params.get("pickup");
  const returnRaw = params.get("return");
  const pickupDate = pickupRaw ? new Date(pickupRaw) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; })();
  const returnDate = returnRaw ? new Date(returnRaw) : (() => { const d = new Date(); d.setDate(d.getDate() + 4); d.setHours(18, 0, 0, 0); return d; })();

  const formatDateShort = (d) => d.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });
  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
  
  useEffect(() => {
    if (!getMember()) {
      navigate("/login");
    }
  }, [navigate]);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  
  const amount = car.pricePerDay * days;

  const handlePayment = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      setError("Please fill out all driver details before paying.");
      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName.trim())) {
      setError("First name can only contain letters and spaces.");
      return;
    }
    if (!nameRegex.test(lastName.trim())) {
      setError("Last name can only contain letters and spaces.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile.trim())) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    setError("");
    setPaying(true);
    
    try {
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = resolve; s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      const res = await fetch("/api/payments/demo-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const rzp = new window.Razorpay({
        key: "rzp_test_TLEXRM7N4kO22g",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "DriveOn",
        description: `Booking: ${car.brand} ${car.name} (${days} days)`,
        order_id: data.order.id,
        handler: () => {
          const bookingId = "DVO-" + Math.floor(10000 + Math.random() * 90000);
          const fmtDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          saveBooking({
            id: bookingId,
            car: car,
            start: fmtDate(pickupDate),
            end: fmtDate(returnDate),
            status: "Upcoming",
            amount: amount,
          });
          navigate(`/booking?car=${car.id}&paid=true`);
        },
        prefill: { name: `${firstName} ${lastName}`.trim(), email: email, contact: mobile },
        theme: { color: "#1a1a2e" },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on("payment.failed", () => { alert("Payment failed!"); setPaying(false); });
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Could not initiate payment. Make sure backend is running.");
      setPaying(false);
    }
  };

  if (paid) { const latestBooking = (() => { try { const key = "userBookings_" + (getMember()?.email || "guest"); const bookings = JSON.parse(localStorage.getItem(key) || "[]"); return bookings[0] || null; } catch(e) { return null; } })(); const tripId = latestBooking?.id || "DVO-" + Math.floor(10000 + Math.random() * 90000); return <PageShell><section className="success-screen wrap"><span className="success-mark"><Check /></span><p className="eyebrow">BOOKING CONFIRMED</p><h1>You're all set for<br /><em>the open road.</em></h1><p>Your {car.name} is reserved from {formatDateShort(pickupDate)} to {formatDateShort(returnDate)}. We've emailed the confirmation details.</p><div className="confirmation-card"><img src={car.image} alt="" /><div><strong>DRIVEON TRIP #{tripId}</strong><span>{car.name} \u00b7 {formatDateShort(pickupDate)} \u2014 {formatDateShort(returnDate)}</span></div><Link to="/my-bookings">View trip <ArrowRight size={16} /></Link></div><Link className="button button-dark" to="/cars">Keep exploring</Link></section></PageShell>; }
  return <PageShell className="booking-page">
    <section className="wrap booking-head"><div><p className="eyebrow">ONE LAST STEP</p><h1>Reserve your <em>escape.</em></h1></div><div className="checkout-steps"><span className="done"><Check size={14} /> Trip</span><i /><span className="active">2 Payment</span><i /><span>3 Confirmed</span></div></section><section className="wrap checkout-layout"><div className="checkout-form"><section><h2>Driver details</h2><p>These details help us make pick-up smooth and simple.</p><div className="form-grid"><Field label="First name"><input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field><Field label="Last name"><input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field><Field label="Email address" wide icon={Mail}><input placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field><Field label="Mobile number" wide icon={Phone}><input placeholder="Mobile number" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} /></Field></div>{error && <p className="auth-error" style={{marginTop: "10px", color: "#e74c3c", fontSize: "13px", fontWeight: "500"}}>{error}</p>}</section><label className="terms-check"><input type="checkbox" defaultChecked /> <span>I agree to the <Link to="/terms">rental terms</Link> and understand the cancellation policy.</span></label><button className="button button-dark button-full" type="button" disabled={paying} onClick={handlePayment}>{paying ? "Opening Razorpay..." : <>Confirm & pay \u20b9{currency(amount)} <ArrowRight size={17} /></>}</button></div><aside className="trip-summary"><p className="eyebrow">YOUR TRIP</p><div className="mini-car"><img src={car.image} alt="" /><div><strong>{car.name}</strong><span>{car.transmission} \u00b7 {car.fuelType}</span></div></div><div className="trip-times"><span><i /> {formatDateShort(pickupDate)}<br /><strong>{formatTime(pickupDate)}</strong><small>{car.location}</small></span><b /><span><i /> {formatDateShort(returnDate)}<br /><strong>{formatTime(returnDate)}</strong><small>{car.location}</small></span></div><div className="summary-prices"><p><span>Rental ({days} {days === 1 ? "day" : "days"})</span><strong>\u20b9{currency(car.pricePerDay * days)}</strong></p><p><span>Protection plan</span><strong>Included</strong></p><div><span>Total</span><strong>\u20b9{currency(amount)}</strong></div></div><p className="cancellation"><CheckCircle2 size={16} /> Free cancellation for 24 hours</p></aside></section></PageShell>;
}
