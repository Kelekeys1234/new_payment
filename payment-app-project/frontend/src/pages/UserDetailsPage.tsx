import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/api";
import { MEMBER_TYPE_LABELS, type UserPaymentSummary } from "../types/User";
import PaymentTable from "../components/PaymentTable";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<UserPaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          <PaymentTable payments={summary.payments} />
        </>
      )}
    </>
  );
}
