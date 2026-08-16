import { useState } from "react";
import Modal from "./Modal";
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

interface FormErrors {
  createdBy?: string;
  isVisitor?: string;
  paymentType?: string;
  paymentPurpose?: string;
  amount?: string;
  currency?: string;
}

export default function PaymentEditModal({
  payment,
  onClose,
  onSaved,
}: {
  payment: Payment;
  onClose: () => void;
  onSaved: (updated: Payment) => void;
}) {
  const [createdBy, setCreatedBy] = useState(payment.createdBy);
  const [isVisitor, setIsVisitor] = useState<boolean>(payment.isVisitor);
  const [paymentType, setPaymentType] = useState<PaymentType>(payment.paymentType);
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>(payment.paymentPurpose);
  const [paymentFrequency, setPaymentFrequency] = useState<import("../types/Payment").PaymentFrequency>(
    (payment as any).paymentFrequency ?? "ONE_TIME"
  );
  const [amount, setAmount] = useState(String(payment.amount));
  const [currency, setCurrency] = useState<CurrencyCode>(payment.currency);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!createdBy.trim()) next.createdBy = "Created by is required.";
    const amountNum = Number(amount);
    if (!amount.trim()) {
      next.amount = "Amount is required.";
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      next.amount = "Amount must be greater than zero.";
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
      const updated = await paymentService.update(payment.id, {
        createdBy: createdBy.trim(),
        isVisitor,
        paymentType,
        paymentPurpose,
        paymentFrequency,
        amount: Number(amount),
        currency,
      });
      onSaved(updated);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Edit Payment ${payment.id}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="editCreatedBy">
            Created By<span className="field-required">*</span>
          </label>
          <input
            id="editCreatedBy"
            className={"text-input" + (errors.createdBy ? " has-error" : "")}
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
          {errors.createdBy && <div className="field-error">{errors.createdBy}</div>}
        </div>

        <div className="field">
          <label className="field-label">
            Are you a visitor?<span className="field-required">*</span>
          </label>
          <div className="radio-group horizontal">
            <label className={"radio-option" + (isVisitor ? " checked" : "")}>
              <input type="radio" name="editIsVisitor" checked={isVisitor} onChange={() => setIsVisitor(true)} />
              <span className="radio-option-label">Yes, visitor</span>
            </label>
            <label className={"radio-option" + (!isVisitor ? " checked" : "")}>
              <input type="radio" name="editIsVisitor" checked={!isVisitor} onChange={() => setIsVisitor(false)} />
              <span className="radio-option-label">No, not a visitor</span>
            </label>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editPaymentType">
            Payment Type<span className="field-required">*</span>
          </label>
          <div className="select-wrap">
            <select
              id="editPaymentType"
              className="select-input"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            >
              {(Object.keys(PAYMENT_TYPE_LABELS) as PaymentType[]).map((type) => (
                <option key={type} value={type}>
                  {PAYMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="field">
          <label className="field-label">
            Payment Purpose<span className="field-required">*</span>
          </label>
          <div className="radio-group horizontal">
            <label className={"radio-option" + (paymentPurpose === "LOAN" ? " checked" : "")}>
              <input
                type="radio"
                name="editPaymentPurpose"
                checked={paymentPurpose === "LOAN"}
                onChange={() => setPaymentPurpose("LOAN")}
              />
              <span className="radio-option-label">Loan</span>
            </label>
            <label className={"radio-option" + (paymentPurpose === "DONATION" ? " checked" : "")}>
              <input
                type="radio"
                name="editPaymentPurpose"
                checked={paymentPurpose === "DONATION"}
                onChange={() => setPaymentPurpose("DONATION")}
              />
              <span className="radio-option-label">Donation</span>
            </label>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editPaymentFrequency">
            Payment Frequency<span className="field-required">*</span>
          </label>
          <div className="select-wrap">
            <select
              id="editPaymentFrequency"
              className="select-input"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(e.target.value as any)}
            >
              <option value="ONE_TIME">One-time</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editAmount">
            Amount<span className="field-required">*</span>
          </label>
          <div className="amount-input-wrap">
            <span className="amount-prefix">{CURRENCY_SYMBOLS[currency]}</span>
            <input
              id="editAmount"
              className={"text-input" + (errors.amount ? " has-error" : "")}
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(v)) setAmount(v);
              }}
            />
          </div>
          {errors.amount && <div className="field-error">{errors.amount}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editCurrency">
            Currency<span className="field-required">*</span>
          </label>
          <div className="select-wrap">
            <select
              id="editCurrency"
              className="select-input"
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
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: 16 }}>
            {submitError}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
