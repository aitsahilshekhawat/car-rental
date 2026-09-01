import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import CarCard from "../components/CarCard";
import { getFavoritesKey } from "./shared";

export function Favorites() { 
  const [favoriteCars, setFavoriteCars] = useState(() => {
    const saved = localStorage.getItem(getFavoritesKey());
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const saved = localStorage.getItem(getFavoritesKey());
      setFavoriteCars(saved ? JSON.parse(saved) : []);
    };
    
    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    return () => window.removeEventListener('favorites-updated', handleFavoritesUpdate);
  }, []);

  const handleUnsave = (carId) => {
    const newFavorites = favoriteCars.filter(c => c.id !== carId);
    setFavoriteCars(newFavorites);
    localStorage.setItem(getFavoritesKey(), JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('favorites-updated'));
  };

  return (
    <PageShell footer={false}>
      <PortalLayout title="Saved for later" eyebrow="YOUR SHORTLIST">
        <p className="portal-subcopy">The cars that caught your eye, ready when you are.</p>
        
        {favoriteCars.length > 0 ? (
          <div className="car-grid favorite-grid">
            {favoriteCars.map((car) => (
              <CarCard car={car} saved key={car.id} onToggleSave={() => handleUnsave(car.id)} />
            ))}
          </div>
        ) : (
          <div style={{ padding: "80px 0", textAlign: "center", border: "1px dashed #ddd", borderRadius: "12px", marginTop: "20px" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>NO FAVORITES</p>
            <h3 style={{ fontSize: "24px", marginBottom: "12px", color: "#111" }}>Your shortlist is empty</h3>
            <p style={{ color: "#666", marginBottom: "24px" }}>Start exploring and save cars you love.</p>
            <Link className="button button-dark" to="/cars">Explore cars</Link>
          </div>
        )}
      </PortalLayout>
    </PageShell>
  ); 
}
