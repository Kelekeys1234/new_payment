import { Link } from "react-router-dom";
import { CURRENCY_SYMBOLS, PAYMENT_TYPE_LABELS, PAYMENT_FREQUENCY_LABELS, type Payment } from "../types/Payment";

export default function PaymentTable({
  payments,
  onEdit,
  onDelete,
}: {
  payments: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}) {
  const showActions = Boolean(onEdit || onDelete);

  if (payments.length === 0) {
    return (
      <div className="table-scroll">
        <div className="empty-state">
          <div className="empty-state-title">No payments match these filters</div>
          Try widening your search or clearing a filter.
        </div>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>User</th>
            <th>Visitor</th>
            <th>Payment Type</th>
            <th>Purpose</th>
          <th>Frequency</th>
          <th>Amount</th>
          <th>Created By</th>
          <th>Created</th>
          {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td className="mono">{p.id}</td>
              <td>
                {p.userId ? (
                  <Link to={`/users/${p.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <span className="table-name">{p.userName ?? "Unknown"}</span>
                    <span className="table-sub">{p.phoneNumber}</span>
                  </Link>
                ) : (
                  <span className="table-name">{p.userName ?? "Unknown"}</span>
                )}
              </td>
              <td>
                {p.isVisitor ? (
                  <span className="pill visitor-yes">Visitor</span>
                ) : (
                  <span className="pill">Non-visitor</span>
                )}
              </td>
              <td>{PAYMENT_TYPE_LABELS[p.paymentType]}</td>
              <td>
                <span className={"pill " + (p.paymentPurpose === "LOAN" ? "purpose-loan" : "purpose-donation")}>
                  {p.paymentPurpose === "LOAN" ? "Loan" : "Donation"}
                </span>
              </td>
              <td>{PAYMENT_FREQUENCY_LABELS[p.paymentFrequency]}</td>
              <td className="mono">
                {CURRENCY_SYMBOLS[p.currency]}
                {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {" "}
                {p.currency}
              </td>
              <td>{p.createdBy}</td>
              <td className="mono">
                {new Date(p.created).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              {showActions && (
                <td>
                  <div className="table-actions">
                    {onEdit && (
                      <button className="btn btn-secondary btn-small" type="button" onClick={() => onEdit(p)}>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn btn-danger btn-small" type="button" onClick={() => onDelete(p)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
