import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({
  require,
  children,
}: {
  require: "auth" | "admin" | "superAdmin";
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="table-scroll">
        <div className="empty-state">
          <span className="spinner dark" style={{ display: "inline-block" }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const insufficientRole =
    (require === "admin" && !user.admin) || (require === "superAdmin" && !user.superAdmin);

  if (insufficientRole) {
    return (
      <div className="card">
        <div className="field-error">You do not have permission to view this page.</div>
      </div>
    );
  }

  return <>{children}</>;
}
