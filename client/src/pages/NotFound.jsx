import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "../components/Layout";

export function NotFound() { return <PageShell><section className="not-found wrap"><p className="eyebrow">404 · WRONG TURN</p><h1>This road doesn't<br />go <em>anywhere.</em></h1><p>Looks like this page took the scenic route. Let's get you back on track.</p><Link className="button button-dark" to="/">Take me home <ArrowRight size={17} /></Link><span>Lost? <Link to="/help-center">Visit Help Centre</Link></span></section></PageShell>; }
