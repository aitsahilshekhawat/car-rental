import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BadgeCheck, Calendar, Car, CheckCircle2, CreditCard, IndianRupee } from "lucide-react";
import PageShell from "../components/Layout";
import CarCard from "../components/CarCard";
import { cars } from "../data/cars";
import { SearchBar, SectionTitle } from "./shared";

export function Home() {
  const navigate = useNavigate();
  return <PageShell className="home-page">
    <section className="hero">
      <div className="hero-background" />
      <div className="hero-content wrap">
        <div className="hero-copy"><p className="hero-kicker">RENT THE JOURNEY, NOT JUST THE CAR</p><h1>Every drive has<br /><em>a story.</em></h1><p>Find the car that makes yours unforgettable.</p></div>
        <SearchBar dark onSearch={({ location }) => navigate(`/cars${location ? `?location=${encodeURIComponent(location)}` : ""}`)} />
        <div className="hero-trust"><span><CheckCircle2 size={16} /> Fully insured</span><span><CheckCircle2 size={16} /> 24/7 roadside help</span><span><CheckCircle2 size={16} /> Free cancellation</span></div>
      </div>
      <span className="hero-credit">Photo: DriveOn experiences</span>
    </section>

    <section className="featured-section wrap section-pad">
      <SectionTitle label="MAKE A GREAT ESCAPE" title="Ready when you are." link="/cars" />
      <div className="car-grid featured-grid">{cars.slice(0, 3).map((car) => <CarCard car={car} key={car.id} />)}</div>
    </section>

    <section className="experience-section">
      <div className="wrap experience-grid">
        <div className="experience-image"><img src="https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1400&q=85" alt="Driver on a scenic road" /><span className="image-note"><i /> Curated cars, cared for deeply</span></div>
        <div className="experience-copy"><p className="eyebrow">THE DRIVEON DIFFERENCE</p><h2>Renting, but<br />more <em>human.</em></h2><p>Every car is chosen for how it makes you feel on the road. Every host is local and every journey is backed by people who genuinely care.</p><div className="number-stats"><div><strong>1,500+</strong><span>Exceptional cars</span></div><div><strong>4.9/5</strong><span>Guest rating</span></div><div><strong>32</strong><span>Cities and counting</span></div></div><Link className="button button-light" to="/about">Why DriveOn <ArrowRight size={17} /></Link></div>
      </div>
    </section>


    <section className="booking-journey-section">
      <div className="wrap">
        <SectionTitle label="BOOK WITH CONFIDENCE" title={<>A clear way from plan to <em>road.</em></>} copy="Everything you need to reserve your car is right where you expect it to be." />
        <ol className="booking-journey">
          <li><span className="journey-icon journey-sage"><Calendar size={25} /></span><div><strong>01</strong><h3>Choose city & dates</h3><p>Tell us where you're going and when you want to leave.</p></div></li>
          <li><span className="journey-icon journey-sand"><Car size={28} /></span><div><strong>02</strong><h3>Find your car</h3><p>Pick the car and delivery option that fit your plan.</p></div></li>
          <li><span className="journey-icon journey-blue"><BadgeCheck size={27} /></span><div><strong>03</strong><h3>Verify yourself</h3><p>Share your licence details once, securely and simply.</p></div></li>
          <li><span className="journey-icon journey-peach"><CreditCard size={27} /></span><div><strong>04</strong><h3>Pay securely</h3><p>Confirm your booking and get ready for the open road.</p></div></li>
        </ol>
      </div>
    </section>

    <section className="home-benefits wrap">
      <SectionTitle label="THE DETAILS MATTER" title="A better rental, by design." />
      <div className="benefit-grid">
        <article><span className="benefit-icon payment-icon"><CreditCard size={27} /></span><h3>Multiple payment options</h3><p>Pay the way that works for you—cards, net banking, UPI and more.</p></article>
        <article><span className="benefit-icon cancel-icon"><Calendar size={27} /></span><h3>Flexible cancellation</h3><p>Plans change. Cancel free within 24 hours and travel with more peace of mind.</p></article>
        <article><span className="benefit-icon price-icon"><IndianRupee size={29} /></span><h3>Best price promise</h3><p>Clear, fair pricing on every car, with no surprises waiting at checkout.</p></article>
      </div>
    </section>

    <section className="host-cta wrap"><div><p className="eyebrow">HAVE A CAR TO SHARE?</p><h2>Let your car take you further.</h2><p>Turn the time your car is parked into something more rewarding.</p><Link className="button button-sand" to="/become-host">Become a host <ArrowRight size={17} /></Link></div><img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85" alt="A car on the road" /></section>
  </PageShell>;
}
