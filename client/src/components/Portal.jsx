import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Heart, UserRound, CreditCard, CarFront, Plus, Settings, ChevronLeft, ShieldCheck, Users } from "lucide-react";
import { getMember } from "../services/session";
import { useEffect } from "react";

const userNav = [
  ["Overview", "/user-dashboard", LayoutDashboard],
  ["My bookings", "/my-bookings", CalendarDays],
  ["Saved cars", "/favorites", Heart],
  ["Payment history", "/payment-history", CreditCard],
  ["Profile", "/profile", UserRound],
];

const hostNav = [
  ["Host overview", "/host-dashboard", LayoutDashboard],
  ["Your cars", "/add-car", CarFront],
  ["Add a car", "/add-car?new=true", Plus],
  ["Settings", "/profile", Settings],
];

const adminNav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Add a car", "/add-car?new=true", Plus],
  ["Manage Users", "/manage-users", Users],
  ["Host Applications", "/host-applications", CarFront],
  ["Settings", "/profile", Settings],
];

export function PortalLayout({ children, title, eyebrow = "Your account", type = "user", action }) {
  const navigate = useNavigate();
  const member = getMember();
  
  useEffect(() => {
    if (!member) {
      navigate("/login");
    }
  }, [member, navigate]);

  if (!member) return null;

  const role = member.role;
  const effectiveType = (role === "admin" || role === "manager") ? "admin" : type;
  const nav = effectiveType === "admin" ? adminNav : effectiveType === "host" ? hostNav : userNav;
  
  const userName = member.name || "Guest";
  const initials = userName.split(' ').map(n => n[0] || '').join('').substring(0, 2).toUpperCase() || "U";
  
  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <Link className="portal-back" to="/"><ChevronLeft size={17} /> Back to DriveOn</Link>
        <div className="portal-profile"><span style={(() => { const img = localStorage.getItem("profileImg") || member.profilePicture; return img ? { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" } : {}; })()}>{(() => { const img = localStorage.getItem("profileImg") || member.profilePicture; return img ? "" : initials; })()}</span><div><strong>{userName}</strong><small>{type === "host" ? "Verified host" : `Member since ${new Date().getFullYear()}`}</small></div></div>
        <nav>{nav.map(([label, to, Icon]) => <NavLink key={label} to={to}><Icon size={18} />{label}</NavLink>)}</nav>
        <div className="sidebar-help"><ShieldCheck size={18} /><span><strong>Need assistance?</strong><small>We’re here, 24/7</small></span></div>
      </aside>
      <section className="portal-content">
        <header className="portal-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</header>
        {children}
      </section>
    </div>
  );
}
