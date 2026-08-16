import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "New Payment", end: true },
  { to: "/payments", label: "Payment History" },
  { to: "/users", label: "Users" },
  { to: "/register", label: "Register User" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-mark">₦</span>
          NEHEMIAH BUILDING
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
