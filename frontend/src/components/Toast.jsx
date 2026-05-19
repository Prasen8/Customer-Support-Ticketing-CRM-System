import { useState, useEffect, useCallback } from "react";

/**
 * A fixed-position toast notification system.
 * Usage: import { useToast, ToastContainer } from "./Toast"
 */

let _setToasts = null;

export function useToast() {
  const toast = useCallback((message, type = "success", duration = 3500) => {
    if (!_setToasts) return;
    const id = Date.now();
    _setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      _setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return { toast };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>
            {t.type === "success" ? "✅" : "❌"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
