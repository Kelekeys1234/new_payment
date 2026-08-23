import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import { givingIntentService } from "../services/givingIntentService";
import { getErrorMessage } from "../services/api";

// Placeholder bank details for now — swap these for the real account once provided.
const ACCOUNT_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Nehemiah Builders Partners International",
  accountNumber: "0123456789",
};

const POLL_INTERVAL_MS = 4000;

type Step = "details" | "waiting" | "form";

export default function PaymentPage() {
  const [step, setStep] = useState<Step>("details");
  const [token, setToken] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const navigate = useNavigate();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleHavePaid() {
    setStartError(null);
    setStarting(true);
    try {
      const intent = await givingIntentService.create();
      setToken(intent.token);
      setStep("waiting");
      pollRef.current = setInterval(async () => {
        try {
          const current = await givingIntentService.getStatus(intent.token);
          if (current.status === "CONFIRMED") {
            if (pollRef.current) clearInterval(pollRef.current);
            setStep("form");
          }
          // PENDING / NOT_CONFIRMED: keep waiting, no change shown to the giver.
        } catch {
          // transient polling errors are ignored; the next tick tries again
        }
      }, POLL_INTERVAL_MS);
    } catch (error) {
      setStartError(getErrorMessage(error));
    } finally {
      setStarting(false);
    }
  }

  function handleHaventPaid() {
    navigate("/");
  }

  if (step === "form") {
    return (
      <>
        <div className="page-header">
          <p className="page-eyebrow">New Entry</p>
          <h1 className="page-title">NEHEMIAH BUILDERS PARTNERS INTERNATIONAL</h1>
          <p className="page-subtitle">Please provide the payment information below.</p>
        </div>
        <PaymentForm />
      </>
    );
  }

  if (step === "waiting") {
    return (
      <>
        <div className="page-header">
          <p className="page-eyebrow">Give</p>
          <h1 className="page-title">Waiting for confirmation</h1>
          <p className="page-subtitle">
            We've notified our finance team that you've made a payment. This page will move to the
            details form automatically once they confirm.
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <span className="spinner dark" style={{ marginBottom: 16 }} />
          <p className="field-hint" style={{ marginTop: 12 }}>
            You don't need to refresh this page — it checks automatically.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Give</p>
        <h1 className="page-title">NEHEMIAH BUILDERS PARTNERS INTERNATIONAL</h1>
        <p className="page-subtitle">Make your transfer to the account below, then let us know.</p>
      </div>

      <div className="receipt">
        <div className="receipt-head">
          <h2 className="page-title" style={{ fontSize: 20 }}>
            Account Details
          </h2>
        </div>
        <div className="receipt-perforation" />
        <div className="receipt-body">
          <div className="receipt-row">
            <span className="receipt-row-label">Bank Name</span>
            <span className="receipt-row-value">{ACCOUNT_DETAILS.bankName}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-row-label">Account Name</span>
            <span className="receipt-row-value">{ACCOUNT_DETAILS.accountName}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-row-label">Account Number</span>
            <span className="receipt-row-value">{ACCOUNT_DETAILS.accountNumber}</span>
          </div>
        </div>
        <div className="receipt-actions" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {startError && <div className="field-error">{startError}</div>}
          <button className="btn btn-primary" type="button" onClick={handleHavePaid} disabled={starting}>
            {starting && <span className="spinner" />}
            {starting ? "Please wait..." : "I have paid"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleHaventPaid}
            disabled={starting}
            style={{ width: "100%" }}
          >
            I haven't paid yet
          </button>
        </div>
      </div>
    </>
  );
}
