import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import PageShell from "../components/Layout";
import CarCard from "../components/CarCard";
import { cars } from "../data/cars";
import { carApi } from "../services/api";
import { SearchBar } from "./shared";

export function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchLocation = searchParams.get("location") || "";
  const pickupParam = searchParams.get("pickup");
  const returnParam = searchParams.get("return");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState("All cars");
  
  const displayPickup = pickupParam ? new Date(pickupParam) : new Date();
  const displayReturn = returnParam ? new Date(returnParam) : new Date(new Date().setDate(new Date().getDate() + 3));
  
  const formatDateForEyebrow = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };
  const datesText = `${formatDateForEyebrow(displayPickup)} — ${formatDateForEyebrow(displayReturn)}`;
  const [limit, setLimit] = useState(12);

  const [dbCars, setDbCars] = useState([]);

  useEffect(() => {
    carApi.list().then(data => {
      const apiCars = (data.cars || []).map(c => ({
        id: c._id, name: c.name, brand: c.brand || c.name?.split(" ")[0] || "Unknown", type: c.type || "Premium",
        pricePerDay: c.pricePerDay, fuelType: c.fuelType || "Petrol", transmission: c.transmission || "Automatic",
        seatingCapacity: c.seatingCapacity || 5, location: c.location,
        rating: c.averageRating || 4.5, reviews: c.totalReviews || 0,
        accent: "#d1d5db",
        ownerName: c.owner ? c.owner.name : null,
        ownerEmail: c.owner ? c.owner.email : null,
        image: c.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85",
      }));
      setDbCars(apiCars);
    }).catch(() => {});
  }, []);

  const allCars = useMemo(() => {
    const staticIds = new Set(cars.map(c => c.id));
    const unique = dbCars.filter(c => !staticIds.has(c.id));
    return [...cars, ...unique];
  }, [dbCars]);

  const filtered = useMemo(() => {
    let result = allCars;
    if (active !== "All cars") {
      result = result.filter((car) => car.type === active);
    }
    if (searchLocation) {
      result = result.filter((car) => car.location.toLowerCase().includes(searchLocation.toLowerCase()));
    }
    return result;
  }, [active, searchLocation, allCars]);

  const handleSearch = ({ location, pickup, returnDate }) => {
    setSearchParams(prev => {
      if (location) prev.set("location", location);
      else prev.delete("location");
      
      if (pickup) prev.set("pickup", pickup.toISOString());
      if (returnDate) prev.set("return", returnDate.toISOString());
      
      return prev;
    });
  };

  const capitalize = s => s && s[0].toUpperCase() + s.slice(1).toLowerCase();

  return <PageShell className="listing-page">
    <section className="listing-hero"><div className="wrap"><p className="eyebrow">{searchLocation ? `${capitalize(searchLocation)} · ${datesText}` : `All cities · ${datesText}`}</p><h1>Find a car that feels like <em>yours.</em></h1><SearchBar initialLocation={searchLocation} initialPickup={pickupParam} initialReturn={returnParam} onSearch={handleSearch} /></div></section>
    <section className="wrap listing-content">
      <h2 className="sr-only" style={{position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}>Available Cars</h2>
      <div className="listing-bar"><p><strong>{filtered.length} cars</strong> available for your voyage</p><button className="filter-trigger" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={17} /> Filters <span>{filtersOpen ? <X size={15} /> : <ChevronDown size={15} />}</span></button></div>{filtersOpen && <div className="filter-drawer"><div><span>Vehicle type</span>{["All cars", "SUV", "Premium", "Luxury", "Electric"].map((item) => <button className={active === item ? "selected" : ""} onClick={() => setActive(item)} key={item}>{item}</button>)}</div><div><span>Transmission</span><button>Automatic</button><button>Manual</button></div><div><span>Price per day</span><input type="range" min="2000" max="10000" defaultValue="8000" /></div></div>}
      <div className="browse-pills">{["All cars", "SUV", "Electric", "Premium", "Weekend favourites"].map((item) => <button className={active === item ? "active" : ""} onClick={() => setActive(item)} key={item}>{item}</button>)}</div><div className="car-grid listing-grid">{filtered.slice(0, limit).map((car) => <CarCard car={car} key={car.id} />)}</div>
      {filtered.length > limit && <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", paddingBottom: "30px" }}><button className="button button-light" onClick={() => setLimit(l => l + 12)}>Load more cars</button></div>}
    </section>
  </PageShell>;
}
