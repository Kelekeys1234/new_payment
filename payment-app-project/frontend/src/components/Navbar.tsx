import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/give", label: "Give" },
  { to: "/payments", label: "Payment History" },
  { to: "/users", label: "Users" },
  { to: "/register", label: "Join Us" },
];

import logoUrl from "../assets/calvary-point-assembly.jpg";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <img src={logoUrl} alt="Calvary Point Assembly International" className="navbar-logo" />
          NEHEMIAH BUILDERS PARTNERS
        </NavLink>
        <nav className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
