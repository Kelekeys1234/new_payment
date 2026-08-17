import { useEffect, useMemo, useState } from "react";
import { paymentService } from "../services/paymentService";
import { getErrorMessage } from "../services/api";
import type { Payment } from "../types/Payment";
import PaymentTable from "../components/PaymentTable";
import PaymentFilters, { DEFAULT_FILTERS, type PaymentFilterState } from "../components/PaymentFilters";

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    paymentService
      .getMe()
      .then((data) => {
        if (!cancelled) setPayments(data);
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
    const q = filters.query.trim().toLowerCase();
    return payments.filter((p) => {
      if (q) {
        const matches =
          p.id.toLowerCase().includes(q) ||
          (p.userName ?? "").toLowerCase().includes(q) ||
          (p.phoneNumber ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.purpose !== "ALL" && p.paymentPurpose !== filters.purpose) return false;
      if (filters.type !== "ALL" && p.paymentType !== filters.type) return false;
      if (filters.currency !== "ALL" && p.currency !== filters.currency) return false;
      if (filters.visitor === "VISITORS" && !p.isVisitor) return false;
      if (filters.visitor === "NON_VISITORS" && p.isVisitor) return false;
      return true;
    });
  }, [payments, filters]);

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Ledger</p>
        <h1 className="page-title">My Payments</h1>
        <p className="page-subtitle">
          {loading ? "Loading your payments..." : `${filtered.length} of ${payments.length} payment${payments.length === 1 ? "" : "s"} shown`}
        </p>
      </div>

      <PaymentFilters filters={filters} onChange={setFilters} />

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
      ) : (
        <PaymentTable payments={filtered} />
      )}
    </>
  );
}
