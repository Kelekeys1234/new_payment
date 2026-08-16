import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/api";
import { MEMBER_TYPE_LABELS, type User } from "../types/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    userService
      .getAll()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.fullName.toLowerCase().includes(q) || u.phoneNumber.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Directory</p>
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Everyone who has been recorded in the system.</p>
      </div>

      <div className="filters-bar">
        <input
          className="text-input"
          type="text"
          placeholder="Search by name or phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link to="/register" className="btn btn-primary" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
          + Register User
        </Link>
      </div>

      {error && (
        <div className="field-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="table-scroll">
          <div className="empty-state">
            <span className="spinner dark" style={{ display: "inline-block" }} />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="table-scroll">
          <div className="empty-state">
            <div className="empty-state-title">No users found</div>
            Try a different search, or record a payment to create one.
          </div>
        </div>
      ) : (
        <div className="user-list">
          {filtered.map((u) => (
            <Link key={u.id} to={`/users/${u.id}`} className="user-list-item">
              <div>
                <div className="user-list-name">{u.fullName}</div>
                <div className="user-list-phone">{u.phoneNumber}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {u.memberType && <span className="pill">{MEMBER_TYPE_LABELS[u.memberType]}</span>}
                <span className="pill">#{u.id}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
