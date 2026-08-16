export interface ToastState {
  message: string;
  variant: "success" | "error";
}

export default function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div className={"toast" + (toast.variant === "error" ? " error" : "")} role="status">
      {toast.message}
    </div>
  );
}
