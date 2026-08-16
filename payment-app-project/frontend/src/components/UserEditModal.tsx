import { useState } from "react";
import Modal from "./Modal";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/api";
import type { MemberType, User } from "../types/User";

const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  createdBy?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  memberType?: string;
}

export default function UserEditModal({
  user,
  onClose,
  onSaved,
}: {
  user: User;
  onClose: () => void;
  onSaved: (updated: User) => void;
}) {
  const [createdBy, setCreatedBy] = useState(user.createdBy);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [address, setAddress] = useState(user.address ?? "");
  const [memberType, setMemberType] = useState<MemberType | "">(user.memberType ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!createdBy.trim()) next.createdBy = "Created by is required.";
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
      const updated = await userService.update(user.id, {
        createdBy: createdBy.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        memberType: memberType as MemberType,
      });
      onSaved(updated);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Edit ${user.fullName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="editUserCreatedBy">
            Created By<span className="field-required">*</span>
          </label>
          <input
            id="editUserCreatedBy"
            className={"text-input" + (errors.createdBy ? " has-error" : "")}
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
          {errors.createdBy && <div className="field-error">{errors.createdBy}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editFullName">
            Full name<span className="field-required">*</span>
          </label>
          <input
            id="editFullName"
            className={"text-input" + (errors.fullName ? " has-error" : "")}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="field-error">{errors.fullName}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editEmail">
            Email<span className="field-required">*</span>
          </label>
          <input
            id="editEmail"
            className={"text-input" + (errors.email ? " has-error" : "")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editPhoneNumber">
            Phone number<span className="field-required">*</span>
          </label>
          <input
            id="editPhoneNumber"
            className={"text-input" + (errors.phoneNumber ? " has-error" : "")}
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="editAddress">
            Address<span className="field-required">*</span>
          </label>
          <input
            id="editAddress"
            className={"text-input" + (errors.address ? " has-error" : "")}
            type="text"
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
                name="editMemberType"
                checked={memberType === "MEMBER"}
                onChange={() => setMemberType("MEMBER")}
              />
              <span className="radio-option-label">Member</span>
            </label>
            <label className={"radio-option" + (memberType === "WORKER" ? " checked" : "")}>
              <input
                type="radio"
                name="editMemberType"
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
