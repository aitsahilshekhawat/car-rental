import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { getBookings, TripCard } from "./shared";

export function MyBookings() { 
  const [activeTab, setActiveTab] = useState("Upcoming");
  const bookings = getBookings();
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "Upcoming") return b.status === "Upcoming";
    if (activeTab === "Completed") return b.status === "Completed";
    if (activeTab === "Cancelled") return b.status === "Cancelled";
    return false;
  });

  return (
    <PageShell footer={false}>
      <PortalLayout title="Your trips" eyebrow="BOOKINGS & ESCAPES">
        <div className="booking-tabs">
          <button className={activeTab === "Upcoming" ? "active" : ""} onClick={() => setActiveTab("Upcoming")}>
            Upcoming <span>{bookings.filter(b => b.status === "Upcoming").length}</span>
          </button>
          <button className={activeTab === "Completed" ? "active" : ""} onClick={() => setActiveTab("Completed")}>
            Past trips <span>{bookings.filter(b => b.status === "Completed").length}</span>
          </button>
          <button className={activeTab === "Cancelled" ? "active" : ""} onClick={() => setActiveTab("Cancelled")}>
            Cancelled <span>{bookings.filter(b => b.status === "Cancelled").length}</span>
          </button>
        </div>
        
        {filteredBookings.length > 0 ? (
          <div className="trip-list">
            {filteredBookings.map((booking) => (
              <TripCard booking={booking} key={booking.id} detailed />
            ))}
          </div>
        ) : (
          <section className="empty-explore" style={{ marginTop: "40px", padding: "60px 40px", textAlign: "center", border: "1px dashed #ddd", borderRadius: "12px" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "8px" }}>NO TRIPS HERE</p>
              <h3 style={{ fontSize: "24px", marginBottom: "12px", color: "#111" }}>Nothing to show</h3>
              <p style={{ color: "#666", marginBottom: "24px" }}>You don't have any {activeTab.toLowerCase()} trips right now.</p>
            </div>
            {activeTab !== "Upcoming" && (
              <Link className="button button-outline" to="/cars">Book a new car</Link>
            )}
          </section>
        )}
        
        {activeTab === "Upcoming" && (
          <section className="empty-explore">
            <div>
              <p className="eyebrow">FEELING RESTLESS?</p>
              <h3>There's a road with your name on it.</h3>
              <p>Find a car for your next plan, spontaneous or otherwise.</p>
            </div>
            <Link className="button button-dark" to="/cars">Explore cars <ArrowRight size={16} /></Link>
          </section>
        )}
      </PortalLayout>
    </PageShell>
  ); 
}
