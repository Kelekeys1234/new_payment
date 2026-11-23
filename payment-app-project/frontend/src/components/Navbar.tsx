import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className={"navbar" + (location.pathname === "/" ? " navbar-home" : "")}>
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-monogram" aria-hidden="true">N</span>
          <span className="navbar-brand-copy">
            <strong>NEHEMIAH BUILDERS</strong>
            <small>PARTNERS INTERNATIONAL</small>
          </span>
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
