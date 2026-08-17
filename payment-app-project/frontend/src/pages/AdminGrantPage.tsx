import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { getErrorMessage } from "../services/api";
import Toast, { type ToastState } from "../components/Toast";

export default function AdminGrantPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const user = await authService.grantAdmin(trimmed);
      setToast({ message: `${user.fullName} now has admin access.`, variant: "success" });
      setPhoneNumber("");
    } catch (err) {
      setToast({ message: getErrorMessage(err), variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Access control</p>
        <h1 className="page-title">Grant Admin Access</h1>
        <p className="page-subtitle">
          Give a registered member permission to view the full payment ledger.
        </p>
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="grantPhone">
            Phone number<span className="field-required">*</span>
          </label>
          <input
            id="grantPhone"
            className="text-input"
            type="tel"
            inputMode="numeric"
            placeholder="+2348012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting && <span className="spinner" />}
          {submitting ? "Granting..." : "Grant Admin Access"}
        </button>
      </form>

      <Toast toast={toast} />
    </>
  );
}
