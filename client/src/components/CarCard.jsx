import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Users, Gauge, Fuel } from "lucide-react";
import { currency } from "../data/cars";
import { getMember } from "../services/session";

function getFavoritesKey() {
  const member = getMember();
  return "favoriteCars_" + (member ? member.email : "guest");
}

export default function CarCard({ car, compact = false, saved = false, onToggleSave }) {
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const stored = localStorage.getItem(getFavoritesKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.some(c => c.id === car.id)) return true;
      }
    } catch (e) {}
    return saved;
  });
  
  const handleSaveClick = (e) => {
    e.preventDefault();
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      const stored = localStorage.getItem(getFavoritesKey());
      let parsed = [];
      if (stored) {
        parsed = JSON.parse(stored);
      }
      
      if (nextSavedState) {
        if (!parsed.some(c => c.id === car.id)) {
          parsed.push(car);
        }
      } else {
        parsed = parsed.filter(c => c.id !== car.id);
      }
      localStorage.setItem(getFavoritesKey(), JSON.stringify(parsed));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (err) {}

    if (onToggleSave) {
      onToggleSave(car.id);
    }
  };

  return (
    <article className={`car-card ${compact ? "car-card-compact" : ""}`}>
      <Link className="car-photo" to={`/cars/${car.id}`}>
        <img src={car.image} alt={car.name} />
        <span className="car-type">{car.type}</span>
        <button className={`save-car ${isSaved ? "saved" : ""}`} aria-label={`Save ${car.name}`} onClick={handleSaveClick}><Heart size={18} fill={isSaved ? "currentColor" : "none"} /></button>
      </Link>
      <div className="car-card-copy">
        <div className="car-card-heading"><div><p className="eyebrow">{car.brand}</p><h3>{car.name.replace(`${car.brand} `, "")}</h3></div><span className="rating"><Star size={14} fill="currentColor" /> {car.rating}</span></div>
        {!compact && <div className="car-meta"><span><Gauge size={15} /> {car.transmission}</span><span><Fuel size={15} /> {car.fuelType}</span><span><Users size={15} /> {car.seatingCapacity} seats</span></div>}
        <div className="car-card-price"><span><strong>₹{currency(car.pricePerDay)}</strong> / day</span><Link to={`/cars/${car.id}`}>View car <span>↗</span></Link></div>
      </div>
    </article>
  );
}
