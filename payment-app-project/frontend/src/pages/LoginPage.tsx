import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

type Step = "phone" | "password" | "activate";

interface RedirectState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, activate } = useAuth();
  const redirectState = (location.state as RedirectState | null) ?? null;

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notRegistered, setNotRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function afterAuth(user: { admin: boolean }) {
    const destination = redirectState?.from ?? (user.admin ? "/payments" : "/my-payments");
    navigate(destination, { replace: true });
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotRegistered(false);
    const trimmed = phoneNumber.trim();
    if (!trimmed) {
      setError("Enter your phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const status = await authService.status(trimmed);
      if (!status.registered) {
        setNotRegistered(true);
        return;
      }
      if (!status.activated) {
        setStep("activate");
      } else {
        setStep("password");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ phoneNumber: phoneNumber.trim(), password });
      afterAuth(user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleActivateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await activate({
        phoneNumber: phoneNumber.trim(),
        password: newPassword,
      });
      afterAuth(user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function backToPhoneStep() {
    setStep("phone");
    setError(null);
    setNotRegistered(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Account</p>
        <h1 className="page-title">
          {step === "phone" && "Sign in"}
          {step === "password" && "Enter your password"}
          {step === "activate" && "Create your password"}
        </h1>
        <p className="page-subtitle">
          {step === "phone" && "Enter the phone number you registered with to see your own payment history."}
          {step === "password" && "Welcome back. Enter your password to continue."}
          {step === "activate" && "Choose a password for your wallet account."}
        </p>
      </div>

      {step === "phone" && (
        <form className="card" onSubmit={handlePhoneSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="phoneNumber">
              Phone number<span className="field-required">*</span>
            </label>
            <input
              id="phoneNumber"
              className={"text-input" + (error ? " has-error" : "")}
              type="tel"
              inputMode="numeric"
              placeholder="+2348012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoFocus
            />
            {error && <div className="field-error">{error}</div>}
          </div>

          {notRegistered && (
            <div className="user-status not-found" style={{ marginBottom: 20 }}>
              We couldn't find this phone number in our membership records.
              <button
                className="btn btn-secondary btn-small"
                type="button"
                style={{ marginLeft: "auto" }}
                onClick={() => navigate("/register", { state: { phoneNumber: phoneNumber.trim() } })}
              >
              Join
              </button>
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? "Checking..." : "Continue"}
          </button>
        </form>
      )}

      {step === "password" && (
        <form className="card" onSubmit={handlePasswordSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="password">
              Password<span className="field-required">*</span>
            </label>
            <input
              id="password"
              className={"text-input" + (error ? " has-error" : "")}
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="field-error">{error}</div>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            style={{ width: "100%", marginTop: 10 }}
            onClick={backToPhoneStep}
          >
            Use a different number
          </button>
        </form>
      )}

      {step === "activate" && (
        <form className="card" onSubmit={handleActivateSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="newPassword">
              Choose a password<span className="field-required">*</span>
            </label>
            <input
              id="newPassword"
              className="text-input"
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              Confirm password<span className="field-required">*</span>
            </label>
            <input
              id="confirmPassword"
              className={"text-input" + (error ? " has-error" : "")}
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div className="field-error">{error}</div>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting && <span className="spinner" />}
            {submitting ? "Creating account..." : "Create password & continue"}
          </button>
        </form>
      )}
    </>
  );
}
