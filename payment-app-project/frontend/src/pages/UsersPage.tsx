import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/api";
import { MEMBER_TYPE_LABELS, type User } from "../types/User";
import UserEditModal from "../components/UserEditModal";
import Toast, { type ToastState } from "../components/Toast";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

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

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      await userService.remove(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setToast({ message: `${user.fullName} deleted.`, variant: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    } finally {
      setDeletingId(null);
    }
  }

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
            <div key={u.id} className="user-list-row">
              <Link to={`/users/${u.id}`} className="user-list-item">
                <div>
                  <div className="user-list-name">{u.fullName}</div>
                  <div className="user-list-phone">{u.phoneNumber}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {u.memberType && <span className="pill">{MEMBER_TYPE_LABELS[u.memberType]}</span>}
                  <span className="pill">#{u.id}</span>
                </div>
              </Link>
              <div className="table-actions">
                <button className="btn btn-secondary btn-small" type="button" onClick={() => setEditingUser(u)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  type="button"
                  onClick={() => handleDelete(u)}
                  disabled={deletingId === u.id}
                >
                  {deletingId === u.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setEditingUser(null);
            setToast({ message: `${updated.fullName} updated.`, variant: "success" });
          }}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}
