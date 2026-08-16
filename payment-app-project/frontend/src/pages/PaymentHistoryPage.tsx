import { useEffect, useMemo, useState } from "react";
import { paymentService } from "../services/paymentService";
import { getErrorMessage } from "../services/api";
import type { Payment } from "../types/Payment";
import PaymentTable from "../components/PaymentTable";
import PaymentFilters, { DEFAULT_FILTERS, type PaymentFilterState } from "../components/PaymentFilters";
import PaymentEditModal from "../components/PaymentEditModal";
import Toast, { type ToastState } from "../components/Toast";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilterState>(DEFAULT_FILTERS);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    paymentService
      .getAll()
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

  async function handleDelete(payment: Payment) {
    if (!window.confirm(`Delete payment ${payment.id}? This cannot be undone.`)) return;
    setDeletingId(payment.id);
    try {
      await paymentService.remove(payment.id);
      setPayments((prev) => prev.filter((p) => p.id !== payment.id));
      setToast({ message: `Payment ${payment.id} deleted.`, variant: "success" });
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Ledger</p>
        <h1 className="page-title">Payment History</h1>
        <p className="page-subtitle">
          {loading ? "Loading payments..." : `${filtered.length} of ${payments.length} payment${payments.length === 1 ? "" : "s"} shown`}
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
        <PaymentTable
          payments={filtered}
          onEdit={setEditingPayment}
          onDelete={deletingId ? undefined : handleDelete}
        />
      )}

      {editingPayment && (
        <PaymentEditModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSaved={(updated) => {
            setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingPayment(null);
            setToast({ message: `Payment ${updated.id} updated.`, variant: "success" });
          }}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}
