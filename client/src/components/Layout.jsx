import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays, CarFront, ChevronDown, ClipboardList, Heart, LayoutDashboard,
  LogOut, MapPin, Menu, ShieldCheck, UserRound, X,
} from "lucide-react";
import { authApi } from "../services/api";
import { clearMember, getMember } from "../services/session";

const navItems = [
  ["Explore cars", "/cars"],
];

export function Logo({ light = false }) {
  return (
    <Link className={`logo ${light ? "logo-light" : ""}`} to="/">
      <span className="logo-mark"><i /><i /><i /></span>
      <span>driveon</span>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [member, setMember] = useState(() => getMember());
  const accountMenu = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isPortal = /dashboard|profile|bookings|payment|manage|host-applications|add-car|edit-car|favorites/.test(location.pathname);
  const isAdmin = member?.role === "admin" || member?.role === "manager";
  const initials = member?.name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "DR";
  const memberItems = [
    ["Your rides", "/my-bookings", CarFront],
    ["Favourites", "/favorites", Heart],
    ["My profile", "/profile", UserRound],
    ["My dashboard", "/user-dashboard", LayoutDashboard],
  ];
  const adminItems = [
    ["Admin dashboard", "/dashboard", ShieldCheck],
    ["Manage bookings", "/dashboard#bookings", ClipboardList],
  ];

  useEffect(() => {
    const updateMember = () => setMember(getMember());
    window.addEventListener("driveon-member-change", updateMember);
    return () => window.removeEventListener("driveon-member-change", updateMember);
  }, []);

  useEffect(() => {
    const closeMenus = () => { setMenuOpen(false); setAccountOpen(false); };
    const closeOnOutsideClick = (event) => {
      if (accountMenu.current && !accountMenu.current.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => { document.removeEventListener("mousedown", closeOnOutsideClick); closeMenus(); };
  }, [location.pathname]);

  const logout = async () => {
    await authApi.logout().catch(() => {});
    clearMember();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const accountLinks = (items, mobile = false) => items.map(([label, to, Icon]) => (
    <Link key={label} className={mobile ? "mobile-account-link" : "account-menu-link"} onClick={() => { setAccountOpen(false); setMenuOpen(false); }} to={to}>
      <Icon size={mobile ? 18 : 17} /><span>{label}</span>{!mobile && <ChevronDown size={16} />}
    </Link>
  ));

  return (
    <header className={`site-header ${isPortal ? "site-header-portal" : ""}`}>
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          {member ? (
            <div className="account-menu" ref={accountMenu}>
              <button className="account-trigger" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-haspopup="menu">
                {member.profilePicture ? <img src={member.profilePicture} alt="" /> : <span>{initials}</span>}
                <strong>{member.name?.split(" ")[0] || "Account"}</strong><ChevronDown size={15} />
              </button>
              {accountOpen && <div className="account-dropdown" role="menu">
                <div className="account-summary">
                  {member.profilePicture ? <img src={member.profilePicture} alt="" /> : <span>{initials}</span>}
                  <div><strong>{member.name}</strong><small>{member.email}</small></div>
                </div>
                <div className="account-menu-links">{accountLinks(memberItems)}</div>
                {isAdmin && <div className="account-menu-links account-admin-links"><p>Admin</p>{accountLinks(adminItems)}</div>}
                <button className="account-logout" onClick={logout}><LogOut size={17} /> Log out</button>
              </div>}
            </div>
          ) : <><Link className="text-link login-link" to="/login">Log in</Link><Link className="button button-dark button-small" to="/register">Sign up</Link></>}
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, to]) => <NavLink onClick={() => setMenuOpen(false)} key={to} to={to}>{label}</NavLink>)}
          {member ? <div className="mobile-account-menu"><div className="mobile-account-summary"><span>{initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div></div>{accountLinks(memberItems, true)}{isAdmin && <><p>Admin</p>{accountLinks(adminItems, true)}</>}<button onClick={logout}><LogOut size={18} /> Log out</button></div> : <><Link onClick={() => setMenuOpen(false)} to="/login">Log in</Link><Link onClick={() => setMenuOpen(false)} to="/register">Create account</Link></>}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Logo light />
          <p className="footer-intro">The more considered way to get where you’re going.</p>
          <div className="footer-contact">hello@driveon.in &nbsp; · &nbsp; +91 800 000 0144</div>
        </div>
        <div className="footer-links">
          <div><span>Discover</span><Link to="/cars">Browse cars</Link><Link to="/compare">Compare cars</Link><Link to="/become-host">Become a host</Link></div>
          <div><span>Support</span><Link to="/help-center">Help centre</Link><Link to="/contact">Contact us</Link><Link to="/terms">Terms of use</Link></div>
          <div><span>Account</span><Link to="/my-bookings">My trips</Link><Link to="/favorites">Saved cars</Link><Link to="/profile">Profile</Link></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 DriveOn Mobility Pvt. Ltd.</span><div><Link to="/privacy-policy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
    </footer>
  );
}

export default function PageShell({ children, className = "", footer = true }) {
  return <div className={`app-shell ${className}`}><Header /><main>{children}</main>{footer && <Footer />}</div>;
}
