import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../components/Toast";

const CATEGORIES = [
  { value: "Technical", icon: "ti-cpu" },
  { value: "Billing", icon: "ti-credit-card" },
  { value: "Account", icon: "ti-user-circle" },
  { value: "Feature Request", icon: "ti-bulb" },
  { value: "Performance", icon: "ti-bolt" },
  { value: "Other", icon: "ti-dots-circle-horizontal" },
];

const PRIORITIES = [
  { value: "Low", activeColor: "var(--status-closed)", activeBg: "var(--status-closed-bg)", activeBorder: "var(--status-closed-border)" },
  { value: "Medium", activeColor: "var(--status-progress)", activeBg: "var(--status-progress-bg)", activeBorder: "var(--status-progress-border)" },
  { value: "High", activeColor: "var(--red-500)", activeBg: "var(--red-bg)", activeBorder: "rgba(239,68,68,0.35)" },
];

export default function CreateTicket() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "Technical",
    priority: "Low",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await API.post("/api/tickets", form);
      setSubmitted(true);
      toast("Ticket submitted successfully!", "success");
      setTimeout(() => navigate("/my-tickets"), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create ticket.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="crm-main">
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--status-closed-bg)",
            border: "1px solid var(--status-closed-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}>
            <i className="ti ti-check" style={{ fontSize: 24, color: "var(--status-closed)" }} aria-hidden="true" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Ticket submitted</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            We've received your request and will respond within 1–2 business days.
          </p>
          <Link to="/my-tickets" className="btn btn-secondary">
            Back to my tickets
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="crm-main">
      <Link to="/my-tickets" className="back-link">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to tickets
      </Link>

      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-sm)",
            background: "rgba(79,110,247,0.12)",
            border: "1px solid rgba(79,110,247,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="ti ti-ticket" style={{ fontSize: 18, color: "var(--brand-400)" }} aria-hidden="true" />
          </div>
          <div>
            <h1 className="page-title">New support ticket</h1>
            <p className="page-subtitle">Describe your issue and our team will get back to you.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
        {/* Issue Details */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 16,
          }}>Issue details</p>

          {/* Category */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 4 }}>
              {CATEGORIES.map(({ value, icon }) => {
                const isSelected = form.category === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, category: value }))}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 6, padding: "12px 8px",
                      borderRadius: "var(--radius-sm)",
                      border: isSelected ? "1px solid rgba(79,110,247,0.5)" : "1px solid var(--border-default)",
                      background: isSelected ? "rgba(79,110,247,0.1)" : "var(--surface-2)",
                      color: isSelected ? "var(--brand-400)" : "var(--text-secondary)",
                      fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    <i className={`ti ${icon}`} style={{ fontSize: 20 }} aria-hidden="true" />
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {PRIORITIES.map(({ value, activeColor, activeBg, activeBorder }) => {
                const isSelected = form.priority === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, priority: value }))}
                    style={{
                      flex: 1, display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 7,
                      padding: "8px 12px", borderRadius: "var(--radius-sm)",
                      border: isSelected ? `1px solid ${activeBorder}` : "1px solid var(--border-default)",
                      background: isSelected ? activeBg : "var(--surface-2)",
                      color: isSelected ? activeColor : "var(--text-secondary)",
                      fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: isSelected ? activeColor : "var(--text-muted)",
                    }} />
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 16,
          }}>Description</p>

          {/* Subject */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="form-label">Subject</label>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>required</span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Unable to export reports as PDF"
              value={form.subject}
              onChange={(e) => {
                set("subject")(e);
                if (errors.subject) setErrors((p) => ({ ...p, subject: null }));
              }}
              style={errors.subject ? { borderColor: "var(--red-500)" } : {}}
            />
            {errors.subject && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--red-500)", marginTop: 5 }}>
                <i className="ti ti-alert-circle" style={{ fontSize: 14 }} aria-hidden="true" />
                {errors.subject}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="form-label">Details</label>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {form.description.length} / 2000
              </span>
            </div>
            <textarea
              className="form-control"
              placeholder="What happened? What did you expect? Include any error messages or steps to reproduce..."
              rows={6}
              maxLength={2000}
              value={form.description}
              onChange={(e) => {
                set("description")(e);
                if (errors.description) setErrors((p) => ({ ...p, description: null }));
              }}
              style={errors.description ? { borderColor: "var(--red-500)" } : {}}
            />
            {errors.description && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--red-500)", marginTop: 5 }}>
                <i className="ti ti-alert-circle" style={{ fontSize: 14 }} aria-hidden="true" />
                {errors.description}
              </span>
            )}
          </div>

          {/* Tip */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            padding: "10px 12px", marginTop: 12,
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            fontSize: 13, color: "var(--text-secondary)",
          }}>
            <i className="ti ti-info-circle" style={{ fontSize: 16, color: "var(--brand-400)", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            Include your browser, OS, and any error messages — this helps us resolve issues faster.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/my-tickets" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? (
              <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting...</>
            ) : (
              <><i className="ti ti-send" style={{ fontSize: 15 }} aria-hidden="true" /> Submit ticket</>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}