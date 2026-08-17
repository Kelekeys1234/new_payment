import PaymentForm from "../components/PaymentForm";

export default function PaymentPage() {
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
