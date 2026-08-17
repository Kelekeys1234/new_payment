import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

type Step = "phone" | "password" | "activate";

interface RedirectState {
  from?: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, activate } = useAuth();
  const redirectState = (location.state as RedirectState | null) ?? null;

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notRegistered, setNotRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, []);

  function startCooldown() {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1 && cooldownTimer.current) {
          clearInterval(cooldownTimer.current);
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);
  }

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
        setOtpNotice(null);
        await authService.requestOtp(trimmed);
        setOtpNotice("We've sent a verification code to your phone.");
        startCooldown();
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
    if (!/^[0-9]{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code sent to your phone.");
      return;
    }
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
        otp: otp.trim(),
        password: newPassword,
      });
      afterAuth(user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setSubmitting(true);
    try {
      await authService.requestOtp(phoneNumber.trim());
      setOtpNotice("A new code has been sent to your phone.");
      startCooldown();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function backToPhoneStep() {
    setStep("phone");
    setError(null);
    setOtpNotice(null);
    setNotRegistered(false);
    setPassword("");
    setOtp("");
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
          {step === "activate" && "Verify your phone"}
        </h1>
        <p className="page-subtitle">
          {step === "phone" && "Enter the phone number you registered with to see your own payment history."}
          {step === "password" && "Welcome back. Enter your password to continue."}
          {step === "activate" && "This is your first time signing in - confirm the code we sent and choose a password."}
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
                Register
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
          {otpNotice && (
            <div className="user-status found" style={{ marginBottom: 20 }}>
              {otpNotice}
            </div>
          )}

          <div className="field">
            <label className="field-label" htmlFor="otp">
              Verification code<span className="field-required">*</span>
            </label>
            <input
              id="otp"
              className="text-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
          </div>

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
            {submitting ? "Verifying..." : "Verify & continue"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            style={{ width: "100%", marginTop: 10 }}
            onClick={handleResend}
            disabled={submitting || resendCooldown > 0}
          >
            {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
          </button>
        </form>
      )}
    </>
  );
}
