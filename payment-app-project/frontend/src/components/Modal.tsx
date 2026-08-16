import type { ReactNode } from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="card">
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <h2 className="modal-title">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
