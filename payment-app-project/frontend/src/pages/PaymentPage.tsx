import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";

// Placeholder bank details for now — swap these for the real account once provided.
const ACCOUNT_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Nehemiah Builders Partners International",
  accountNumber: "0123456789",
};

type Step = "details" | "form";

export default function PaymentPage() {
  const [step, setStep] = useState<Step>("details");
  const navigate = useNavigate();

  function handleHavePaid() {
    setStep("form");
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
          <button className="btn btn-primary" type="button" onClick={handleHavePaid}>
            I have paid
          </button>
          <button className="btn btn-secondary" type="button" onClick={handleHaventPaid} style={{ width: "100%" }}>
            I haven't paid yet
          </button>
        </div>
      </div>
    </>
  );
}
