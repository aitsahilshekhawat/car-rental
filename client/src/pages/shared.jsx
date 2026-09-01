import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Calendar, Car, Check, CheckCircle2,
  CreditCard, Fuel, Gauge, IndianRupee, Lock,
  Mail, MapPin, Minus, Plus, Search, ShieldCheck,
  Sparkles, Star, Upload, Users,
} from "lucide-react";
import PageShell from "../components/Layout";
import { cars, currency } from "../data/cars";
import { getMember } from "../services/session";
import { carApi, profileApi } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const formatDate = (date) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);

export const MAJOR_CITIES = [
  "Agartala", "Agra", "Ahmedabad", "Aizawl", "Ajmer", "Aligarh", "Allahabad", "Amaravati", "Amravati", "Amritsar", "Asansol", "Aurangabad", "Bareilly", "Belgaum", "Bengaluru", "Bhavnagar", "Bhilai", "Bhiwandi", "Bhopal", "Bhubaneswar", "Bikaner", "Chandigarh", "Chennai", "Coimbatore", "Cuttack", "Dehradun", "Delhi", "Dhanbad", "Dispur", "Durgapur", "Erode", "Faridabad", "Firozabad", "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Goa", "Gorakhpur", "Gulbarga", "Guntur", "Gurugram", "Guwahati", "Gwalior", "Hubli-Dharwad", "Hyderabad", "Imphal", "Indore", "Itanagar", "Jabalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jhansi", "Jodhpur", "Kalyan-Dombivli", "Kanpur", "Kochi", "Kohima", "Kolhapur", "Kolkata", "Kota", "Lucknow", "Ludhiana", "Madurai", "Mangalore", "Meerut", "Moradabad", "Mumbai", "Mysore", "Nagpur", "Nanded", "Nashik", "Navi Mumbai", "Nellore", "Noida", "Panaji", "Patna", "Pimpri-Chinchwad", "Pune", "Raipur", "Rajkot", "Ranchi", "Rourkela", "Saharanpur", "Salem", "Shillong", "Shimla", "Siliguri", "Srinagar", "Surat", "Thane", "Thiruvananthapuram", "Tiruchirappalli", "Tirunelveli", "Udaipur", "Ujjain", "Vadodara", "Varanasi", "Vasai-Virar", "Vijayawada", "Visakhapatnam", "Warangal"
];

export function SearchBar({ dark = false, onSearch, initialLocation = "", initialPickup, initialReturn }) {
  const [location, setLocation] = useState(initialLocation);
  const [pickup, setPickup] = useState(initialPickup ? new Date(initialPickup) : new Date());
  const [returnDate, setReturnDate] = useState(initialReturn ? new Date(initialReturn) : new Date(new Date().setDate(new Date().getDate() + 3)));
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = useMemo(() => {
    if (!location.trim()) return [];
    return MAJOR_CITIES.filter(c => c.toLowerCase().includes(location.trim().toLowerCase())).slice(0, 8);
  }, [location]);

  return <form className={`search-panel ${dark ? "search-panel-dark" : ""}`} onSubmit={(event) => { event.preventDefault(); onSearch?.({ location, pickup, returnDate }); }}>
    <label className="location-field"><MapPin size={18} /><span><small>Pick-up location</small>
      <input 
        value={location} 
        onChange={e => { setLocation(e.target.value); e.target.setCustomValidity(""); setShowSuggestions(true); }} 
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onInvalid={e => e.target.setCustomValidity("City not selected")}
        placeholder="Select city..." 
        autoComplete="off"
        required
      />
      {showSuggestions && filteredCities.length > 0 && (
        <ul className="custom-suggestions">
          {filteredCities.map(city => (
            <li key={city} onClick={() => { setLocation(city); setShowSuggestions(false); }}>{city}</li>
          ))}
        </ul>
      )}
    </span></label>
    <div className="search-field"><Calendar size={18} /><span><small>Pick-up</small><DatePicker selected={pickup} onChange={date => { setPickup(date); if (returnDate < date) { setReturnDate(new Date(new Date(date).setDate(date.getDate() + 3))); } }} dateFormat="dd MMM yyyy" placeholderText="Add date" /></span></div>
    <div className="search-field"><Calendar size={18} /><span><small>Return</small><DatePicker selected={returnDate} onChange={date => setReturnDate(date)} dateFormat="dd MMM yyyy" placeholderText="Add date" minDate={pickup} /></span></div>
    <button className="search-submit" aria-label="Search cars"><Search size={21} /></button>
  </form>;
}

export function SectionTitle({ label, title, copy, link, children }) {
  return <div className="section-heading">
    <div><p className="eyebrow">{label}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>
    {link && <Link className="arrow-link" to={link}>{children || "See all cars"} <ArrowUpRight size={17} /></Link>}
  </div>;
}

export function Field({ label, icon: Icon, children, wide = false }) {
  return <label className={`form-field ${wide ? "form-wide" : ""}`}><span>{label}</span><div>{Icon && <Icon size={18} />}{children}</div></label>;
}

export function InfoPill({ icon: Icon, children }) { return <span className="info-pill"><Icon size={16} />{children}</span>; }

export function AuthLayout({ title, copy, children, footer }) { return <div className="auth-page"><Link className="auth-logo" to="/"><span className="logo-mark"><i /><i /><i /></span> driveon</Link><div className="auth-layout"><section className="auth-aside"><p className="eyebrow">A BETTER WAY TO GO</p><h1>Every road is<br />more <em>yours</em> now.</h1><p>Sign in to manage your bookings, save the cars you love and make the most of every escape.</p><div className="auth-aside-quote"><span>&ldquo;</span><p>So smooth, so simple. It felt like the trip started the moment I booked.</p><small>— Aditi, DriveOn member</small></div></section><main className="auth-card"><div><p className="eyebrow">WELCOME TO DRIVEON</p><h2>{title}</h2><p>{copy}</p></div>{children}{footer && <p className="auth-footer">{footer}</p>}</main></div></div>; }

export function getFavoritesKey() {
  const member = getMember();
  return "favoriteCars_" + (member ? member.email : "guest");
}

const demoBookings = [
  { id: "DVO-58241", car: cars[0], start: "14 Aug", end: "17 Aug", status: "Upcoming", amount: 15309 },
  { id: "DVO-53808", car: cars[2], start: "12 Jul", end: "15 Jul", status: "Completed", amount: 13689 },
];

export function getBookingsKey() {
  const member = getMember();
  return "userBookings_" + (member ? member.email : "guest");
}

export function getBookings() {
  const member = getMember();
  let bookings = [];
  
  // Load user's actual bookings from localStorage
  try {
    const stored = localStorage.getItem(getBookingsKey());
    if (stored) bookings = JSON.parse(stored);
  } catch (e) {}
  
  // Add demo bookings only for demo account
  if (member && member.email === "sahil@example.com") {
    const demoIds = demoBookings.map(b => b.id);
    const nonDupes = bookings.filter(b => !demoIds.includes(b.id));
    bookings = [...demoBookings, ...nonDupes];
  }
  
  return bookings;
}

export function saveBooking(booking) {
  try {
    const stored = localStorage.getItem(getBookingsKey());
    let bookings = stored ? JSON.parse(stored) : [];
    bookings.unshift(booking);
    localStorage.setItem(getBookingsKey(), JSON.stringify(bookings));
  } catch (e) {
    console.error("Failed to save booking", e);
  }
}

export function TripCard({ booking, detailed = false }) { return <article className={`trip-card ${detailed ? "trip-card-detailed" : ""}`}><img src={booking.car.image} alt="" /><div className="trip-car-copy"><p className="eyebrow">{booking.id}</p><h3>{booking.car.name}</h3><p><MapPin size={14} /> {booking.car.location}</p></div><div className="trip-dates"><span>Pick-up<strong>{booking.start}</strong></span><i /><span>Return<strong>{booking.end}</strong></span></div><div className="trip-status"><span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span><strong>₹{currency(booking.amount)}</strong></div>{detailed && <div className="trip-actions"><Link className="button button-outline" to={`/payment-receipt?id=${booking.id}`}>View receipt</Link><button className="text-button">Manage booking <ArrowRight size={16} /></button></div>}</article>; }

export const carFields = ["Car name", "Brand", "Vehicle type", "Price per day", "Fuel type", "Transmission", "Seating capacity", "Location"];

export function CarForm({ car, isNew = false }) {
  const navigate = useNavigate();
  const defaults = car || { name: "", brand: "", type: "SUV", pricePerDay: "", fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, location: "", image: "" };
  const [formData, setFormData] = useState({
    name: defaults.name, brand: defaults.brand, type: defaults.type,
    pricePerDay: defaults.pricePerDay, fuelType: defaults.fuelType,
    transmission: defaults.transmission, seatingCapacity: defaults.seatingCapacity,
    location: defaults.location, image: defaults.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setError("");
    if (!formData.name || !formData.brand || !formData.pricePerDay || !formData.location) {
      setError("Please fill in Car name, Brand, Price per day, and Location.");
      return;
    }
    if (!formData.image) {
      setError("Please provide an image URL for the car.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, pricePerDay: Number(formData.pricePerDay), seatingCapacity: Number(formData.seatingCapacity) };
      if (isNew || !car) {
        await carApi.add(payload);
      } else {
        await carApi.update(car._id || car.id, payload);
      }
      setSaved(true);
      setTimeout(() => navigate("/add-car"), 1500);
    } catch (err) {
      setError(err.message || "Failed to save car.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="car-form-layout"><div className="panel car-editor"><div className="panel-heading"><div><p className="eyebrow">CAR DETAILS</p><h3>Tell guests about your car.</h3></div></div><div className="photo-upload">{formData.image ? <img src={formData.image} alt="" /> : <div style={{ width: "100%", height: "200px", background: "#f5f5f5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No image</div>}<Field label="Image URL"><input placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => updateField("image", e.target.value)} /></Field><span>Paste an image URL for your car listing.</span></div><div className="profile-fields">{carFields.map((field) => { const keyMap = {"Car name":"name","Brand":"brand","Vehicle type":"type","Price per day":"pricePerDay","Fuel type":"fuelType","Transmission":"transmission","Seating capacity":"seatingCapacity","Location":"location"}; const k = keyMap[field]; return <Field key={field} label={field}><input value={formData[k] || ""} onChange={e => updateField(k, e.target.value)} placeholder={field} /></Field>; })}</div><label className="form-field form-wide"><span>About this car</span><div><textarea defaultValue={formData.name ? `A beautifully kept ${formData.name}, ready for your next drive.` : ""} /></div></label>{error && <p style={{ color: "#e74c3c", fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>{error}</p>}<button className="button button-dark" onClick={handleSave} disabled={saving}>{saved ? <><Check />Car saved!</> : saving ? "Saving..." : <>Save changes <ArrowRight size={17} /></>}</button></div><aside className="editor-tip"><Sparkles size={22} /><h3>Great listings get noticed.</h3><p>Clear photos and complete details help guests feel confident about booking.</p><Link to="/help-center">Listing tips <ArrowUpRight size={15} /></Link></aside></div>;
}

export const termsBlocks = [
  ["1. Using DriveOn", "DriveOn helps guests find and book cars from trusted local hosts. By creating an account, booking a car or listing a vehicle, you agree to these terms and our community standards."],
  ["2. Booking a car", "When you submit a booking request, you authorise us to collect the amount shown at checkout once the host confirms it. You are responsible for providing accurate information and arriving with the required documents."],
  ["3. Cancellations", "You can cancel within 24 hours of booking for a full refund unless your trip begins within that window. Cancellations after that time are subject to the policy displayed at checkout."],
  ["4. Looking after cars", "Guests must treat every vehicle with care, use it lawfully and return it on time in substantially the same condition. Hosts must provide vehicles that are safe, insured and accurately represented."],
];

export function LegalPage({ privacy = false }) { const title = privacy ? "Your privacy,\nclearly stated." : "A few ground rules\nfor the road."; const blocks = privacy ? [["What we collect", "We collect the information needed to run DriveOn safely and smoothly, including account details, booking information, identity documents and payments."],["How we use it", "We use your information to provide bookings, process payments, improve the service, prevent fraud and send important updates about your account or trips."],["When we share it", "We only share the relevant information with hosts, guests and trusted service providers needed to make a trip happen. We never sell your personal information."],["Your choices", "You can update your profile, change communication preferences or ask us to access, correct or delete your information by contacting our support team."]] : termsBlocks; return <PageShell><section className="legal-hero"><div className="wrap"><p className="eyebrow">LAST UPDATED: AUGUST 2026</p><h1>{title.split("\n")[0]}<br /><em>{title.split("\n")[1]}</em></h1><p>{privacy ? "The information you share with us deserves to be handled with care." : "The simple expectations that help every DriveOn trip run smoothly."}</p></div></section><section className="wrap legal-layout"><aside><p>On this page</p>{blocks.map(([heading]) => <a href={`#${heading.replaceAll(" ", "-")}`} key={heading}>{heading}</a>)}</aside><article>{blocks.map(([heading, paragraph]) => <section id={heading.replaceAll(" ", "-")} key={heading}><h2>{heading}</h2><p>{paragraph}</p><p>We've written this in plain language because clarity matters. If anything is unclear, please <Link to="/contact">reach out to our team</Link> and we'll help.</p></section>)}</article></section></PageShell>; }
