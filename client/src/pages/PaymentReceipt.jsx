import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PageShell from "../components/Layout";
import { cars, currency } from "../data/cars";
import { getMember } from "../services/session";

export function PaymentReceipt() { 
  const [params] = useSearchParams(); 
  const member = getMember();
  const userName = (member && member.name) ? member.name : "User";
  const userEmail = (member && member.email) ? member.email : "";

  const receiptId = params.get("id") || "DVO-58241";
  const booking = (() => { try { const key = "userBookings_" + (member?.email || "guest"); const bookings = JSON.parse(localStorage.getItem(key) || "[]"); return bookings.find(b => b.id === receiptId) || bookings[0] || null; } catch(e) { return null; } })();
  const bCar = booking?.car || cars[0];
  const bAmount = booking?.amount || bCar.pricePerDay * 3;
  const bDays = booking ? Math.max(1, Math.round(bAmount / bCar.pricePerDay)) : 3;
  const paidDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const paidTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return <PageShell><section className="receipt-page wrap"><div className="receipt-toolbar"><Link to="/payment-history">\u2190 Back to payment history</Link><button className="button button-outline" onClick={() => window.print()}>Print receipt</button></div><article className="receipt"><div className="receipt-header"><div className="logo"><span className="logo-mark"><i /><i /><i /></span> driveon</div><div><p>PAYMENT RECEIPT</p><strong>{receiptId}</strong></div></div><div className="receipt-status"><span><CheckCircle2 /> Payment successful</span><small>Paid on {paidDate}, {paidTime}</small></div><div className="receipt-detail-grid"><div><span>Billed to</span><strong>{userName}</strong><p>{userEmail}</p></div><div><span>Payment method</span><strong>Razorpay</strong><p>Booking ID<br />{receiptId}</p></div></div><div className="receipt-car"><img src={bCar.image} alt="" /><div><p className="eyebrow">YOUR TRIP</p><h3>{bCar.name}</h3><span>{booking ? `${booking.start} \u2014 ${booking.end}` : "Check My Bookings"}</span></div><strong>\u20b9{currency(bAmount)}</strong></div><div className="receipt-costs"><p><span>Rental ({bDays} {bDays === 1 ? "day" : "days"} \u00d7 \u20b9{currency(bCar.pricePerDay)})</span><strong>\u20b9{currency(bAmount)}</strong></p><p><span>Protection plan</span><strong>Included</strong></p><div><span>Total paid</span><strong>\u20b9{currency(bAmount)}</strong></div></div><div className="receipt-footer">Questions about this payment? <Link to="/contact">Talk to support</Link><span>DriveOn Mobility Pvt. Ltd. \u00b7 GSTIN 27AAECD0012A1ZT</span></div></article></section></PageShell>; 
}
