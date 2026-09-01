import { Link, useSearchParams } from "react-router-dom";
import { Plus, SlidersHorizontal, Star } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { cars, currency } from "../data/cars";
import { CarForm } from "./shared";

export function AddCar() { const [params] = useSearchParams(); const isNew = params.get("new") === "true"; return <PageShell footer={false}><PortalLayout title={isNew ? "Add a car" : "Your cars"} eyebrow="HOST SPACE" type="host" action={!isNew && <Link className="button button-dark" to="/add-car?new=true"><Plus size={17} /> Add a car</Link>}>{isNew ? <CarForm isNew /> : <><div className="host-list-intro"><p>You have <strong>2 cars</strong> listed and earning.</p><button className="filter-trigger"><SlidersHorizontal size={16} /> Filter</button></div><div className="host-car-list">{cars.slice(0,2).map((car, i) => <article key={car.id}><img src={car.image} alt="" /><div><p className="eyebrow">{i ? "BOOKED UNTIL 18 AUG" : "AVAILABLE NOW"}</p><h3>{car.name}</h3><p>{car.location} \u00b7 \u20b9{currency(car.pricePerDay)} / day</p><span><Star size={14} fill="currentColor" /> {car.rating} \u00b7 {i ? "6" : "8"} bookings</span></div><div><span className={`status ${i ? "pending" : "completed"}`}>{i ? "Booked" : "Active"}</span><Link className="button button-outline" to={`/edit-car/${car.id}`}>Edit car</Link></div></article>)}</div></>}</PortalLayout></PageShell>; }
