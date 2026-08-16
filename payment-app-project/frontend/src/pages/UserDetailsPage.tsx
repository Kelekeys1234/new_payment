import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { paymentService } from "../services/paymentService";
import { getErrorMessage } from "../services/api";
import { MEMBER_TYPE_LABELS, type UserPaymentSummary } from "../types/User";
import type { Payment } from "../types/Payment";
import PaymentTable from "../components/PaymentTable";
import PaymentEditModal from "../components/PaymentEditModal";
import UserEditModal from "../components/UserEditModal";
import Toast, { type ToastState } from "../components/Toast";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<UserPaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    userService
      .getSummary(Number(id))
      .then((data) => {
        if (!cancelled) setSummary(data);
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
  }, [id]);

  async function reload() {
    if (!id) return;
    try {
      const data = await userService.getSummary(Number(id));
      setSummary(data);
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    }
  }

  async function handleDeleteUser() {
    if (!summary) return;
    if (!window.confirm(`Delete ${summary.user.fullName}? This cannot be undone.`)) return;
    setDeletingUser(true);
    try {
      await userService.remove(summary.user.id);
      navigate("/users");
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    } finally {
      setDeletingUser(false);
    }
  }

  async function handleDeletePayment(payment: Payment) {
    if (!window.confirm(`Delete payment ${payment.id}? This cannot be undone.`)) return;
    setDeletingPaymentId(payment.id);
    try {
      await paymentService.remove(payment.id);
      await reload();
      setToast({ message: `Payment ${payment.id} deleted.`, variant: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    } finally {
      setDeletingPaymentId(null);
    }
  }

  return (
    <>
      <Link to="/users" className="back-link">
        ← Back to Users
      </Link>

      {loading && (
        <div className="table-scroll">
          <div className="empty-state">
            <span className="spinner dark" style={{ display: "inline-block" }} />
          </div>
        </div>
      )}

      {error && <div className="field-error">{error}</div>}

      {summary && (
        <>
          <div className="page-header">
            <p className="page-eyebrow">User</p>
            <h1 className="page-title">{summary.user.fullName}</h1>
            <p className="page-subtitle mono">{summary.user.phoneNumber}</p>
            <p className="page-subtitle">
              {summary.user.email && <>{summary.user.email} · </>}
              {summary.user.address && <>{summary.user.address} · </>}
              {summary.user.memberType && MEMBER_TYPE_LABELS[summary.user.memberType]}
            </p>
            <div className="table-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-secondary btn-small" type="button" onClick={() => setEditingUser(true)}>
                Edit User
              </button>
              <button
                className="btn btn-danger btn-small"
                type="button"
                onClick={handleDeleteUser}
                disabled={deletingUser}
              >
                {deletingUser ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Payments</div>
              <div className="stat-value">{summary.totalPayments}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Loans</div>
              <div className="stat-value">₦{summary.totalLoans.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Donations</div>
              <div className="stat-value">
                ₦{summary.totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Amount</div>
              <div className="stat-value">₦{summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <PaymentTable
            payments={summary.payments}
            onEdit={setEditingPayment}
            onDelete={deletingPaymentId ? undefined : handleDeletePayment}
          />
        </>
      )}

      {editingUser && summary && (
        <UserEditModal
          user={summary.user}
          onClose={() => setEditingUser(false)}
          onSaved={() => {
            setEditingUser(false);
            reload();
            setToast({ message: "User updated.", variant: "success" });
          }}
        />
      )}

      {editingPayment && (
        <PaymentEditModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSaved={() => {
            setEditingPayment(null);
            reload();
            setToast({ message: `Payment ${editingPayment.id} updated.`, variant: "success" });
          }}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}
