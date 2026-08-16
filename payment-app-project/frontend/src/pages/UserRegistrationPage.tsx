import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/api";
import type { MemberType } from "../types/User";

const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  memberType?: string;
}

interface RedirectState {
  phoneNumber?: string;
}

export default function UserRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectState = (location.state as RedirectState | null) ?? null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(redirectState?.phoneNumber ?? "");
  const [address, setAddress] = useState("");
  const [memberType, setMemberType] = useState<MemberType | "">("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredName, setRegisteredName] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!phoneNumber.trim()) {
      next.phoneNumber = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(phoneNumber.trim())) {
      next.phoneNumber = "Enter a valid phone number (digits only, 7-15 characters).";
    }
    if (!address.trim()) next.address = "Address is required.";
    if (!memberType) next.memberType = "Select member or worker.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await userService.create({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        memberType: memberType as MemberType,
      });
      setRegisteredName(user.fullName);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setMemberType("");
    setErrors({});
    setSubmitError(null);
    setRegisteredName(null);
  }

  if (registeredName) {
    return (
      <>
        <div className="page-header">
          <p className="page-eyebrow">Registration</p>
          <h1 className="page-title">NEHEMIAH BUILDING USER REGISTRATION</h1>
        </div>
        <div className="receipt">
          <div className="receipt-head">
            <div className="receipt-badge">✓</div>
            <h2 className="page-title" style={{ fontSize: 20 }}>
              {registeredName} was registered successfully
            </h2>
          </div>
          <div className="receipt-actions">
            <button className="btn btn-primary" onClick={resetForm} type="button">
              Register another user
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/users")} type="button">
              View users
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">Registration</p>
        <h1 className="page-title">NEHEMIAH BUILDING USER REGISTRATION</h1>
        <p className="page-subtitle">
          {redirectState?.phoneNumber
            ? "We couldn't find this phone number in our membership records. Please complete registration below."
            : "Register a new member or worker."}
        </p>
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="fullName">
            Full name<span className="field-required">*</span>
          </label>
          <input
            id="fullName"
            className={"text-input" + (errors.fullName ? " has-error" : "")}
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="field-error">{errors.fullName}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="email">
            Email<span className="field-required">*</span>
          </label>
          <input
            id="email"
            className={"text-input" + (errors.email ? " has-error" : "")}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="phoneNumber">
            Phone number<span className="field-required">*</span>
          </label>
          <div className="phone-row">
            <div className="select-wrap phone-code">
              <select className="select-input" defaultValue="+234" disabled>
                <option value="+234">🇳🇬 +234</option>
              </select>
            </div>
            <input
              id="phoneNumber"
              className={"text-input" + (errors.phoneNumber ? " has-error" : "")}
              type="tel"
              inputMode="numeric"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="address">
            Address<span className="field-required">*</span>
          </label>
          <input
            id="address"
            className={"text-input" + (errors.address ? " has-error" : "")}
            type="text"
            placeholder="Street, city"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <div className="field-error">{errors.address}</div>}
        </div>

        <div className="field">
          <label className="field-label">
            Member / Worker<span className="field-required">*</span>
          </label>
          <div className="radio-group horizontal">
            <label className={"radio-option" + (memberType === "MEMBER" ? " checked" : "")}>
              <input
                type="radio"
                name="memberType"
                checked={memberType === "MEMBER"}
                onChange={() => setMemberType("MEMBER")}
              />
              <span className="radio-option-label">Member</span>
            </label>
            <label className={"radio-option" + (memberType === "WORKER" ? " checked" : "")}>
              <input
                type="radio"
                name="memberType"
                checked={memberType === "WORKER"}
                onChange={() => setMemberType("WORKER")}
              />
              <span className="radio-option-label">Worker</span>
            </label>
          </div>
          {errors.memberType && <div className="field-error">{errors.memberType}</div>}
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: 16 }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting && <span className="spinner" />}
          {submitting ? "Registering..." : "Register User"}
        </button>
      </form>
    </>
  );
}
