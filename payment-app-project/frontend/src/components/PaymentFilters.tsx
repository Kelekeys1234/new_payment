import type { CurrencyCode, PaymentPurpose, PaymentType } from "../types/Payment";
import { CURRENCY_LABELS, PAYMENT_TYPE_LABELS } from "../types/Payment";

export interface PaymentFilterState {
  query: string;
  purpose: PaymentPurpose | "ALL";
  type: PaymentType | "ALL";
  currency: CurrencyCode | "ALL";
  visitor: "ALL" | "VISITORS" | "NON_VISITORS";
}

export const DEFAULT_FILTERS: PaymentFilterState = {
  query: "",
  purpose: "ALL",
  type: "ALL",
  currency: "ALL",
  visitor: "ALL",
};

export default function PaymentFilters({
  filters,
  onChange,
}: {
  filters: PaymentFilterState;
  onChange: (next: PaymentFilterState) => void;
}) {
  function set<K extends keyof PaymentFilterState>(key: K, value: PaymentFilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filters-bar">
      <input
        className="text-input"
        type="text"
        placeholder="Search by name or phone number"
        value={filters.query}
        onChange={(e) => set("query", e.target.value)}
      />

      <div className="select-wrap">
        <select
          className="select-input"
          value={filters.purpose}
          onChange={(e) => set("purpose", e.target.value as PaymentFilterState["purpose"])}
        >
          <option value="ALL">All purposes</option>
          <option value="LOAN">Loan</option>
          <option value="DONATION">Donation</option>
        </select>
      </div>

      <div className="select-wrap">
        <select
          className="select-input"
          value={filters.type}
          onChange={(e) => set("type", e.target.value as PaymentFilterState["type"])}
        >
          <option value="ALL">All types</option>
          {(Object.keys(PAYMENT_TYPE_LABELS) as PaymentType[]).map((t) => (
            <option key={t} value={t}>
              {PAYMENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="select-wrap">
        <select
          className="select-input"
          value={filters.currency}
          onChange={(e) => set("currency", e.target.value as PaymentFilterState["currency"])}
        >
          <option value="ALL">All currencies</option>
          {(Object.keys(CURRENCY_LABELS) as CurrencyCode[]).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="select-wrap">
        <select
          className="select-input"
          value={filters.visitor}
          onChange={(e) => set("visitor", e.target.value as PaymentFilterState["visitor"])}
        >
          <option value="ALL">All</option>
          <option value="VISITORS">Visitors</option>
          <option value="NON_VISITORS">Non-visitors</option>
        </select>
      </div>
    </div>
  );
}
