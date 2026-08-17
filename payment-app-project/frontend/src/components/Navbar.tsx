import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import logoUrl from "../assets/calvary-point-assembly.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/give", label: "Give" },
    ...(user ? [{ to: "/my-payments", label: "My Payments" }] : []),
    ...(user?.admin ? [{ to: "/payments", label: "Payment History" }, { to: "/users", label: "Users" }] : []),
    ...(user?.superAdmin ? [{ to: "/admin/grant-admin", label: "Grant Admin" }] : []),
    { to: "/register", label: "Join Us" },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

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
          {user ? (
            <button className="navbar-link" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>
              Payment Wallet
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
