import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { paymentService } from "../services/paymentService";
import { getErrorMessage } from "../services/api";
import {
  CURRENCY_LABELS,
  CURRENCY_SYMBOLS,
  PAYMENT_TYPE_LABELS,
  type CurrencyCode,
  type Payment,
  type PaymentPurpose,
  type PaymentType,
} from "../types/Payment";
import type { User } from "../types/User";

type LookupStatus = "idle" | "checking" | "found" | "not-found";

interface FormErrors {
  isVisitor?: string;
  phoneNumber?: string;
  name?: string;
  paymentType?: string;
  paymentPurpose?: string;
  amount?: string;
  currency?: string;
}

const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export default function PaymentForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const navigate = useNavigate();
  const [isVisitor, setIsVisitor] = useState<boolean | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState("");

  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose | "">("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<Payment | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!PHONE_PATTERN.test(phoneNumber.trim())) {
      setLookupStatus("idle");
      setFoundUser(null);
      return;
    }

    setLookupStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const user = await userService.searchByPhone(phoneNumber.trim());
        if (user) {
          setFoundUser(user);
          setLookupStatus("found");
        } else {
          setFoundUser(null);
          setLookupStatus("not-found");
        }
      } catch {
        // Network/server hiccups during live lookup shouldn't block the form -
        // the user can still submit and the backend will validate again.
        setLookupStatus("idle");
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [phoneNumber]);

  // Non-visitors are expected to already be registered members/workers. If their phone
  // number doesn't match any existing user, send them to the registration page instead of
  // letting them create a bare-bones record inline (that inline path is reserved for visitors).
  useEffect(() => {
    if (isVisitor === false && lookupStatus === "not-found") {
      alert("This phone number was not found in Nehemiah Building membership records. Please register first.");
      navigate("/register", { state: { phoneNumber: phoneNumber.trim() } });
    }
  }, [isVisitor, lookupStatus, phoneNumber, navigate]);

  function validate(): boolean {
    const next: FormErrors = {};

    if (isVisitor === null) {
      next.isVisitor = "Please select whether you are a visitor.";
    }
    if (!phoneNumber.trim()) {
      next.phoneNumber = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(phoneNumber.trim())) {
      next.phoneNumber = "Enter a valid phone number (digits only, 7-15 characters).";
    }
    if (lookupStatus === "not-found" && isVisitor === false) {
      next.phoneNumber = "This number is not registered. Please complete registration first.";
    } else if (lookupStatus === "not-found" && !newUserName.trim()) {
      next.name = "Enter a name to create this user.";
    }
    if (!paymentType) {
      next.paymentType = "Select a payment type.";
    }
    if (!paymentPurpose) {
      next.paymentPurpose = "Select a payment purpose.";
    }
    const amountNum = Number(amount);
    if (!amount.trim()) {
      next.amount = "Amount is required.";
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      next.amount = "Amount must be greater than zero.";
    }
    if (!currency) {
      next.currency = "Select a currency.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payment = await paymentService.create({
        phoneNumber: phoneNumber.trim(),
        fullName: lookupStatus === "not-found" ? newUserName.trim() : undefined,
        isVisitor: Boolean(isVisitor),
        paymentType: paymentType as PaymentType,
        paymentPurpose: paymentPurpose as PaymentPurpose,
        amount: amountNumberSafe(amount),
        currency,
      });
      setResult(payment);
      onSubmitted?.();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setIsVisitor(null);
    setPhoneNumber("");
    setLookupStatus("idle");
    setFoundUser(null);
    setNewUserName("");
    setPaymentType("");
    setPaymentPurpose("");
    setAmount("");
    setCurrency("NGN");
    setErrors({});
    setSubmitError(null);
    setResult(null);
  }

  if (result) {
    return <PaymentReceipt payment={result} onNewPayment={resetForm} />;
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      {/* Visitor */}
      <div className="field">
        <label className="field-label">
          Are you a visitor?<span className="field-required">*</span>
        </label>
        <div className="radio-group horizontal">
          <label className={"radio-option" + (isVisitor === true ? " checked" : "")}>
            <input
              type="radio"
              name="isVisitor"
              checked={isVisitor === true}
              onChange={() => setIsVisitor(true)}
            />
            <span className="radio-option-label">Yes, I am a visitor</span>
          </label>
          <label className={"radio-option" + (isVisitor === false ? " checked" : "")}>
            <input
              type="radio"
              name="isVisitor"
              checked={isVisitor === false}
              onChange={() => setIsVisitor(false)}
            />
            <span className="radio-option-label">No, I am not a visitor</span>
          </label>
        </div>
        {errors.isVisitor && <div className="field-error">{errors.isVisitor}</div>}
      </div>

      {/* Phone number + lookup */}
      <div className="field">
        <label className="field-label" htmlFor="phone">
          Phone Number<span className="field-required">*</span>
        </label>
        <div className="phone-row">
          <div className="select-wrap phone-code">
            <select className="select-input" defaultValue="+234" disabled>
              <option value="+234">🇳🇬 +234</option>
            </select>
          </div>
          <input
            id="phone"
            className={"text-input" + (errors.phoneNumber ? " has-error" : "")}
            type="tel"
            inputMode="numeric"
            placeholder="08012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}

        {lookupStatus === "checking" && (
          <div className="user-status not-found">
            <span className="spinner dark" />
            Checking...
          </div>
        )}
        {lookupStatus === "found" && foundUser && (
          <div className="user-status found">
            <span className="user-status-icon">✓</span>
            User found — <strong>{foundUser.fullName}</strong>
          </div>
        )}
        {lookupStatus === "not-found" && isVisitor === false && (
          <div className="user-status not-found" style={{ marginTop: 12 }}>
            Not found in membership records — redirecting to registration...
          </div>
        )}
        {lookupStatus === "not-found" && isVisitor !== false && (
          <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
            <div className="user-status not-found" style={{ marginBottom: 10 }}>
              User not found.
            </div>
            <label className="field-label" htmlFor="newUserName">
              Name<span className="field-required">*</span>
            </label>
            <input
              id="newUserName"
              className={"text-input" + (errors.name ? " has-error" : "")}
              type="text"
              placeholder="Full name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
            <div className="field-hint">
              This creates a basic record. For full registration (email, address, member/worker),
              use the <a href="/register">User Registration</a> page.
            </div>
          </div>
        )}
      </div>

      {/* Payment type */}
      <div className="field">
        <label className="field-label" htmlFor="paymentType">
          Payment Type<span className="field-required">*</span>
        </label>
        <div className="select-wrap">
          <select
            id="paymentType"
            className={"select-input" + (errors.paymentType ? " has-error" : "")}
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
          >
            <option value="" disabled>
              Select a payment type
            </option>
            {(Object.keys(PAYMENT_TYPE_LABELS) as PaymentType[]).map((type) => (
              <option key={type} value={type}>
                {PAYMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        {errors.paymentType && <div className="field-error">{errors.paymentType}</div>}
      </div>

      {/* Payment purpose */}
      <div className="field">
        <label className="field-label">
          Payment Purpose<span className="field-required">*</span>
        </label>
        <div className="radio-group horizontal">
          <label className={"radio-option" + (paymentPurpose === "LOAN" ? " checked" : "")}>
            <input
              type="radio"
              name="paymentPurpose"
              checked={paymentPurpose === "LOAN"}
              onChange={() => setPaymentPurpose("LOAN")}
            />
            <span className="radio-option-label">Loan</span>
          </label>
          <label className={"radio-option" + (paymentPurpose === "DONATION" ? " checked" : "")}>
            <input
              type="radio"
              name="paymentPurpose"
              checked={paymentPurpose === "DONATION"}
              onChange={() => setPaymentPurpose("DONATION")}
            />
            <span className="radio-option-label">Donation</span>
          </label>
        </div>
        {errors.paymentPurpose && <div className="field-error">{errors.paymentPurpose}</div>}
      </div>

      {/* Amount */}
      <div className="field">
        <label className="field-label" htmlFor="amount">
          Amount<span className="field-required">*</span>
        </label>
        <div className="amount-input-wrap">
          <span className="amount-prefix">{CURRENCY_SYMBOLS[currency]}</span>
          <input
            id="amount"
            className={"text-input" + (errors.amount ? " has-error" : "")}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[0-9]*\.?[0-9]*$/.test(v)) setAmount(v);
            }}
          />
        </div>
        {errors.amount && <div className="field-error">{errors.amount}</div>}
      </div>

      {/* Currency */}
      <div className="field">
        <label className="field-label" htmlFor="currency">
          Currency<span className="field-required">*</span>
        </label>
        <div className="select-wrap">
          <select
            id="currency"
            className={"select-input" + (errors.currency ? " has-error" : "")}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            {(Object.keys(CURRENCY_LABELS) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
        {errors.currency && <div className="field-error">{errors.currency}</div>}
      </div>

      {/* Created by (read-only display) */}
      <div className="field">
        <label className="field-label">Created By</label>
        <input className="text-input" value="Diana" disabled />
        <div className="field-hint">Recorded automatically. This will use your signed-in identity once login is added.</div>
      </div>

      {submitError && (
        <div className="field-error" style={{ marginBottom: 16 }}>
          {submitError}
        </div>
      )}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting && <span className="spinner" />}
        {submitting ? "Submitting..." : "Submit Payment"}
      </button>
    </form>
  );
}

function amountNumberSafe(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function PaymentReceipt({ payment, onNewPayment }: { payment: Payment; onNewPayment: () => void }) {
  const symbol = CURRENCY_SYMBOLS[payment.currency];
  const formattedAmount = payment.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const createdDate = new Date(payment.created);

  return (
    <div className="receipt">
      <div className="receipt-head">
        <div className="receipt-badge">✓</div>
        <h2 className="page-title" style={{ fontSize: 20 }}>
          Payment recorded successfully
        </h2>
      </div>
      <div className="receipt-perforation" />
      <div className="receipt-body">
        <div className="receipt-row">
          <span className="receipt-row-label">Payment ID</span>
          <span className="receipt-row-value">{payment.id}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-row-label">Name</span>
          <span className="receipt-row-value">{payment.userName ?? "—"}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-row-label">Amount</span>
          <span className="receipt-row-value">
            {symbol}
            {formattedAmount}
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-row-label">Purpose</span>
          <span className="receipt-row-value">{payment.paymentPurpose === "LOAN" ? "Loan" : "Donation"}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-row-label">Type</span>
          <span className="receipt-row-value">{PAYMENT_TYPE_LABELS[payment.paymentType]}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-row-label">Recorded</span>
          <span className="receipt-row-value">
            {createdDate.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
      <div className="receipt-actions">
        <button className="btn btn-primary" onClick={onNewPayment} type="button">
          Record another payment
        </button>
      </div>
    </div>
  );
}
