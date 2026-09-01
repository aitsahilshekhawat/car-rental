import { Link } from "react-router-dom";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { currency } from "../data/cars";
import { getBookings } from "./shared";

export function PaymentHistory() { 
  const bookings = getBookings();
  const totalAmount = bookings.reduce((sum, item) => sum + item.amount, 0);

  return <PageShell footer={false}><PortalLayout title="Payment history" eyebrow="PAYMENTS & RECEIPTS"><div className="payment-total"><div><span>Total spent with DriveOn</span><strong>\u20b9{currency(totalAmount)}</strong><small>Across {bookings.length} trips</small></div><div><span>Current payment method</span><strong>Razorpay</strong><small>Online payment</small></div><button className="button button-outline">Manage payment methods</button></div><section className="panel history-table"><div className="panel-heading"><div><p className="eyebrow">ALL TRANSACTIONS</p><h3>Your payments</h3></div><button className="filter-trigger"><SlidersHorizontal size={16} /> Filter</button></div><table><thead><tr><th>Date</th><th>Booking</th><th>Car</th><th>Method</th><th>Amount</th><th></th></tr></thead><tbody>{bookings.length === 0 && <tr><td colSpan="6" style={{textAlign: "center", padding: "20px"}}>No transactions yet</td></tr>}{bookings.map((item) => <tr key={item.id}><td>{item.start} {new Date().getFullYear()}</td><td>{item.id}</td><td>{item.car.name}</td><td>Razorpay</td><td><strong>\u20b9{currency(item.amount)}</strong></td><td><Link to={`/payment-receipt?id=${item.id}`}><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table></section></PortalLayout></PageShell>; }
