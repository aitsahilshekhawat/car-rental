import { useParams } from "react-router-dom";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { cars } from "../data/cars";
import { CarForm } from "./shared";

export function EditCar() { const { id } = useParams(); const car = cars.find((item) => item.id === id) || cars[0]; return <PageShell footer={false}><PortalLayout title={`Edit ${car.name}`} eyebrow="HOST SPACE \u00b7 YOUR CARS" type="host"><CarForm car={car} /></PortalLayout></PageShell>; }
