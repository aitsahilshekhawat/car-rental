import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, X } from "lucide-react";
import PageShell from "../components/Layout";
import { cars, currency } from "../data/cars";

export function CompareCars() {
  const [selected, setSelected] = useState(cars.slice(0, 3)); 
  return (
    <PageShell>
      <section className="compare-hero wrap">
        <p className="eyebrow">MAKE THE RIGHT CALL</p>
        <h1>Put your favourites<br /><em>side by side.</em></h1>
        <p>Compare the details that matter, then choose the one that feels right.</p>
      </section>
      <section className="wrap compare-board">
        <div className="compare-cars">
          {selected.map((car, index) => (
            <article key={car.id}>
              <button className="remove-compare" onClick={() => setSelected(selected.filter((_, i) => i !== index))}><X size={17} /></button>
              <img src={car.image} alt="" />
              <p className="eyebrow">{car.brand}</p>
              <h3>{car.name.replace(`${car.brand} `, "")}</h3>
              <strong>₹{currency(car.pricePerDay)} <small>/ day</small></strong>
              <Link className="button button-outline button-full" to={`/cars/${car.id}`}>View car</Link>
            </article>
          ))}
          {selected.length < 3 && (
            <article style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed #ccc', borderRadius: '12px', padding: '20px', background: 'transparent' }}>
              <p className="eyebrow" style={{ marginBottom: '15px' }}>Add a car to compare</p>
              <select 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', fontSize: '14px', outline: 'none' }}
                onChange={(e) => {
                  if (e.target.value) {
                    const newCar = cars.find(c => c.id === e.target.value);
                    setSelected([...selected, newCar]);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select a car...</option>
                {cars.filter(car => !selected.includes(car)).map(car => (
                  <option key={car.id} value={car.id}>{car.brand} {car.name}</option>
                ))}
              </select>
            </article>
          )}
        </div>
        <div className="compare-table">
          <div><span>Best for</span>{selected.map((car) => <strong key={car.id}>{car.type === "SUV" ? "Weekend escapes" : car.type === "Electric" ? "City driving" : "Making an entrance"}</strong>)}</div>
          <div><span>Transmission</span>{selected.map((car) => <strong key={car.id}>{car.transmission}</strong>)}</div>
          <div><span>Fuel</span>{selected.map((car) => <strong key={car.id}>{car.fuelType}</strong>)}</div>
          <div><span>Seats</span>{selected.map((car) => <strong key={car.id}>{car.seatingCapacity} passengers</strong>)}</div>
          <div><span>Guest rating</span>{selected.map((car) => <strong key={car.id}><Star size={14} fill="currentColor" /> {car.rating} ({car.reviews})</strong>)}</div>
          <div><span>Included distance</span>{selected.map((car) => <strong key={car.id}>200 km / day</strong>)}</div>
        </div>
      </section>
    </PageShell>
  ); 
}
