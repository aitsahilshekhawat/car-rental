import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Fuel, Gauge, Heart, MapPin,
  Send, Share, ShieldCheck, Star, Users, X,
} from "lucide-react";
import PageShell from "../components/Layout";
import CarCard from "../components/CarCard";
import { cars, currency } from "../data/cars";
import { carApi, reviewApi } from "../services/api";
import { getMember } from "../services/session";
import { InfoPill, getFavoritesKey } from "./shared";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function CarDetails() {
  const { id } = useParams(); const navigate = useNavigate();
  const staticCar = cars.find((item) => item.id === id);
  const [dbCar, setDbCar] = useState(null);
  const [loading, setLoading] = useState(!staticCar);

  useEffect(() => {
    if (!staticCar) {
      carApi.list().then(data => {
        const found = (data.cars || []).find(c => c._id === id);
        if (found) {
          setDbCar({
            id: found._id, name: found.name, brand: found.brand || found.name?.split(" ")[0] || "Unknown", type: found.type || "Premium",
            pricePerDay: found.pricePerDay, fuelType: found.fuelType || "Petrol", transmission: found.transmission || "Automatic",
            seatingCapacity: found.seatingCapacity || 5, location: found.location,
            rating: found.averageRating || 4.5, reviews: found.totalReviews || 0,
            ownerName: found.owner ? found.owner.name : null,
            image: found.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85",
          });
        }
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id, staticCar]);

  const car = staticCar || dbCar || cars[0];

  const [isSaved, setIsSaved] = useState(() => {
    try {
      const stored = localStorage.getItem(getFavoritesKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.some(c => c.id === car.id);
      }
    } catch (e) {
      console.error("Failed to read favorites", e);
    }
    return false;
  });

  const toggleSave = () => {
    setIsSaved(prev => {
      const newState = !prev;
      try {
        const stored = localStorage.getItem(getFavoritesKey());
        let parsed = stored ? JSON.parse(stored) : [];
        if (newState) {
          if (!parsed.some(c => c.id === car.id)) {
            parsed.push(car);
          }
        } else {
          parsed = parsed.filter(c => c.id !== car.id);
        }
        localStorage.setItem(getFavoritesKey(), JSON.stringify(parsed));
        
        window.dispatchEvent(new Event('favorites-updated'));
      } catch (e) {
        console.error("Failed to update favorites", e);
      }
      return newState;
    });
  };

  const [pickupDate, setPickupDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; });
  const [returnDate, setReturnDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 4); d.setHours(18, 0, 0, 0); return d; });
  const diffTime = Math.abs(returnDate - pickupDate);

  // Photo gallery
  const photos = [
    car.image,
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1400&q=85",
  ];
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index = 0) => { setGalleryIndex(index); setGalleryOpen(true); };
  const closeGallery = () => setGalleryOpen(false);
  const prevPhoto = () => setGalleryIndex((galleryIndex - 1 + photos.length) % photos.length);
  const nextPhoto = () => setGalleryIndex((galleryIndex + 1) % photos.length);

  useEffect(() => {
    if (!galleryOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const member = getMember();

  const carApiId = dbCar ? dbCar.id : id; // DB _id for API calls

  useEffect(() => {
    reviewApi.list(carApiId).then(data => {
      if (Array.isArray(data)) setReviews(data);
    }).catch(() => {});
  }, [carApiId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(""); setReviewSuccess("");
    if (!reviewComment.trim()) { setReviewError("Please write a comment."); return; }
    setSubmitting(true);
    try {
      const res = await reviewApi.add({ carId: carApiId, rating: reviewRating, comment: reviewComment.trim() });
      setReviewSuccess(res.message || "Review submitted!");
      setReviewComment(""); setReviewRating(5);
      // refresh reviews list
      const updated = await reviewApi.list(carApiId);
      if (Array.isArray(updated)) setReviews(updated);
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageShell><section className="wrap" style={{ padding: "100px 0", textAlign: "center" }}><p>Loading car details...</p></section></PageShell>;
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rent this ${car.brand} ${car.name}`,
          text: `Check out this ${car.name} available in ${car.location} on DriveOn!`,
          url: window.location.href,
        });
      } catch (error) { console.log('Error sharing:', error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const dateInputStyle = { background: 'transparent', border: 'none', fontWeight: 600, color: '#111', fontFamily: 'inherit', fontSize: '15px', cursor: 'pointer', outline: 'none', padding: 0, width: '100%', marginTop: '4px' };

  return <PageShell className="details-page">
    <section className="wrap breadcrumbs"><Link to="/cars">Explore cars</Link><span>/</span><span>{car.brand} {car.name}</span></section>
    <section className="wrap detail-gallery"><div className="gallery-main" onClick={() => openGallery(0)} style={{ cursor: "pointer" }}><img src={car.image} alt={car.name} /><div className="gallery-actions" onClick={e => e.stopPropagation()}><button onClick={handleShare}><Share size={20} /> Share</button><button onClick={toggleSave} className={isSaved ? "saved-active" : ""}><Heart size={20} fill={isSaved ? "currentColor" : "none"} color={isSaved ? "#e74c3c" : "currentColor"} /> {isSaved ? "Saved" : "Save"}</button></div></div><div className="gallery-side"><img src={photos[1]} alt="Car details" onClick={() => openGallery(1)} style={{ cursor: "pointer" }} /><img src={photos[2]} alt="Car interior" onClick={() => openGallery(2)} style={{ cursor: "pointer" }} /><button onClick={() => openGallery(0)}>See all photos <ArrowUpRight size={16} /></button></div></section>
    <section className="wrap detail-layout"><div className="detail-copy"><p className="eyebrow">{car.brand.toUpperCase()} · {car.type.toUpperCase()}</p><div className="detail-title"><h1>{car.name}</h1><span className="rating"><Star size={16} fill="currentColor" /> {car.rating} <small>({reviews.length || car.reviews} reviews)</small></span></div><p className="detail-location"><MapPin size={17} /> Available in {car.location}</p><div className="spec-grid"><InfoPill icon={Gauge}>{car.transmission}</InfoPill><InfoPill icon={Fuel}>{car.fuelType}</InfoPill><InfoPill icon={Users}>{car.seatingCapacity} seats</InfoPill><InfoPill icon={ShieldCheck}>Fully insured</InfoPill></div><hr /><h3>The good stuff</h3><p className="body-copy">A beautifully kept {car.name} that makes the everyday feel a little more cinematic. Pick it up in minutes and enjoy the open road with complete peace of mind.</p><div className="feature-checks"><span><Check size={17} /> Sanitised before every trip</span><span><Check size={17} /> 24/7 roadside assistance</span><span><Check size={17} /> 200 km included each day</span><span><Check size={17} /> Instant confirmation</span></div><hr /><h3>Location</h3><p className="body-copy">This car is available for pick-up in {car.location}.</p><div style={{ marginTop: "20px", borderRadius: "12px", overflow: "hidden", height: "300px" }}><iframe title="Car location map" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(car.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} /></div><hr /><h3>Hosted by {car.ownerName ? car.ownerName.split(' ')[0] : "DriveOn"}</h3><div className="host-snippet"><span className="avatar">{car.ownerName ? car.ownerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "DO"}</span><div><strong>{car.ownerName || "DriveOn Team"}</strong><p>{car.ownerName ? "Verified host" : "Official listing"}</p></div><Link to="/contact">Message <ArrowUpRight size={15} /></Link></div>
        <hr />
        <h3>Reviews {reviews.length > 0 && <small style={{ fontWeight: 400, color: "#6b7683" }}>({reviews.length})</small>}</h3>
        {reviews.length > 0 ? <div className="reviews-list">{reviews.map((r) => <div key={r._id} className="review-item"><div className="review-header"><span className="avatar">{(r.user?.name || "U").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}</span><div><strong>{r.user?.name || "User"}</strong><span className="review-stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} color={i < r.rating ? "#e2a63d" : "#ccc"} />)}</span></div><small>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small></div><p>{r.comment}</p></div>)}</div> : <p className="body-copy" style={{ color: "#999" }}>No reviews yet. Be the first to share your experience!</p>}
        {member ? <form className="review-form" onSubmit={handleReviewSubmit}>
          <div className="review-rating-picker"><span>Your rating:</span>{[1,2,3,4,5].map(n => <button type="button" key={n} onClick={() => setReviewRating(n)}><Star size={18} fill={n <= reviewRating ? "currentColor" : "none"} color={n <= reviewRating ? "#e2a63d" : "#ccc"} /></button>)}</div>
          <div className="review-input-row"><input placeholder="Write your review…" value={reviewComment} onChange={e => setReviewComment(e.target.value)} /><button type="submit" className="button button-dark" disabled={submitting}><Send size={15} /></button></div>
          {reviewError && <p className="review-msg review-error">{reviewError}</p>}
          {reviewSuccess && <p className="review-msg review-success">{reviewSuccess}</p>}
        </form> : <p className="body-copy"><Link to="/login" style={{ fontWeight: 600 }}>Log in</Link> to leave a review.</p>}
      </div>
      <aside className="booking-widget"><div><span>From</span><strong>₹{currency(car.pricePerDay)} <small>/ day</small></strong></div><div className="booking-dates"><label>Pick-up<DatePicker selected={pickupDate} onChange={date => { setPickupDate(date); if (returnDate < date) setReturnDate(new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000)); }} dateFormat="dd MMM yyyy" customInput={<input style={dateInputStyle} />} /></label><label>Return<DatePicker selected={returnDate} onChange={date => setReturnDate(date)} dateFormat="dd MMM yyyy" minDate={pickupDate} customInput={<input style={dateInputStyle} />} /></label></div><div className="price-row"><span>{diffDays} {diffDays === 1 ? "day" : "days"} × ₹{currency(car.pricePerDay)}</span><strong>₹{currency(car.pricePerDay * diffDays)}</strong></div><div className="price-row"><span>Protection plan</span><strong>Included</strong></div><div className="price-total"><span>Total</span><strong>₹{currency(car.pricePerDay * diffDays)}</strong></div><button className="button button-dark button-full" onClick={() => { if (!member) { navigate("/login"); } else { navigate(`/booking?car=${car.id}&days=${diffDays}&pickup=${pickupDate.toISOString()}&return=${returnDate.toISOString()}`); } }}>Reserve this car <ArrowRight size={17} /></button><p><ShieldCheck size={15} /> You won't be charged yet</p></aside></section>
    <section className="wrap section-pad related"><div className="section-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2>You might also like</h2></div><Link className="arrow-link" to="/cars">See all cars <ArrowUpRight size={17} /></Link></div><div className="car-grid">{cars.filter((item) => item.id !== car.id).slice(0,3).map((item) => <CarCard car={item} key={item.id} compact />)}</div></section>

    {galleryOpen && <div className="lightbox-overlay" onClick={closeGallery}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={closeGallery}><X size={22} /></button>
        <button className="lightbox-prev" onClick={prevPhoto}><ChevronLeft size={28} /></button>
        <img src={photos[galleryIndex]} alt={`${car.name} photo ${galleryIndex + 1}`} />
        <button className="lightbox-next" onClick={nextPhoto}><ChevronRight size={28} /></button>
        <div className="lightbox-counter">{galleryIndex + 1} / {photos.length}</div>
      </div>
    </div>}
  </PageShell>;
}

