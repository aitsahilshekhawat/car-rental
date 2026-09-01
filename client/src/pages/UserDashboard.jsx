import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Car, CreditCard, Heart, UserRound } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import CarCard from "../components/CarCard";
import { cars } from "../data/cars";
import { getMember } from "../services/session";
import { SectionTitle, getFavoritesKey, getBookings } from "./shared";

export function UserDashboard() { 
  const member = getMember();
  const firstName = (member && member.name) ? member.name.split(' ')[0] : "there";

  let savedCount = 0;
  try {
    const saved = localStorage.getItem(getFavoritesKey());
    if (saved) savedCount = JSON.parse(saved).length;
  } catch(e) {}

  const bookings = getBookings();
  const nextTrip = bookings.find(b => b.status === "Upcoming");

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();

  return (
    <PageShell footer={false}>
      <PortalLayout title={`Good morning, ${firstName}.`} eyebrow={todayStr}>
        {nextTrip ? (
          <section className="dashboard-trip">
            <div className="eyebrow">
              <p className="eyebrow">YOUR NEXT TRIP</p>
              <span className="status upcoming">Upcoming</span>
              <h2>{nextTrip.car.location.split(',')[0]}, here we come.</h2>
              <p>Your next adventure begins soon.</p>
              <Link className="button button-dark" to="/my-bookings">View trip details <ArrowRight size={16} /></Link>
            </div>
            <img src={nextTrip.car.image} alt={nextTrip.car.name} />
            <div className="trip-float">
              <small>YOUR CAR</small>
              <strong>{nextTrip.car.name}</strong>
              <span><Calendar size={14} /> {nextTrip.start} \u2014 {nextTrip.end}</span>
            </div>
          </section>
        ) : (
          <section className="dashboard-trip" style={{ backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eee', marginBottom: '20px' }}><Car size={24} /></span>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Ready for your next escape?</h2>
            <p style={{ margin: '0 0 24px', color: '#666' }}>You have no upcoming trips. Find the perfect car for your next journey.</p>
            <Link className="button button-dark" to="/cars">Explore cars <ArrowRight size={16} /></Link>
          </section>
        )}
        <section className="dashboard-section">
          <SectionTitle label="JUST FOR YOU" title="Continue exploring" link="/cars" />
          <div className="car-grid dashboard-cars">
            {cars.slice(3,6).map((car) => <CarCard car={car} compact key={car.id} />)}
          </div>
        </section>
        <section className="dashboard-quick">
          <Link to="/favorites">
            <Heart />
            <span><strong>Saved cars</strong><small>{savedCount} {savedCount === 1 ? 'car' : 'cars'} waiting for you</small></span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/payment-history">
            <CreditCard />
            <span><strong>Payments</strong><small>View your receipts</small></span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/profile">
            <UserRound />
            <span><strong>Your profile</strong><small>Keep your details up to date</small></span>
            <ArrowRight size={18} />
          </Link>
        </section>
      </PortalLayout>
    </PageShell>
  );
}
