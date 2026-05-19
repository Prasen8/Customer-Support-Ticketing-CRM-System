import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../components/Toast";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email";
    if (!form.password.trim()) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await API.post("/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast("Account created successfully! Please sign in.", "success");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", level: 1, color: "var(--red-500)" };
    if (p.length < 10) return { label: "Fair", level: 2, color: "var(--status-progress)" };
    return { label: "Strong", level: 3, color: "var(--status-closed)" };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="ti ti-ticket" aria-hidden="true" />
          </div>
          <span className="auth-brand-name">Support<span>CRM</span></span>
        </div>

        <div className="auth-header">
          <h1>Create an account</h1>
          <p>Fill in the details below to get started</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-wrapper">
              <i className="ti ti-user input-icon" aria-hidden="true" />
              <input
                id="username"
                type="text"
                className={`form-control input-with-icon${errors.username ? " input-error" : ""}`}
                placeholder="Choose a username"
                value={form.username}
                onChange={(e) => { set("username")(e); if (errors.username) setErrors((p) => ({ ...p, username: null })); }}
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <span className="form-error">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {errors.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrapper">
              <i className="ti ti-mail input-icon" aria-hidden="true" />
              <input
                id="email"
                type="email"
                className={`form-control input-with-icon${errors.email ? " input-error" : ""}`}
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => { set("email")(e); if (errors.email) setErrors((p) => ({ ...p, email: null })); }}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="form-error">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <i className="ti ti-lock input-icon" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control input-with-icon input-with-action${errors.password ? " input-error" : ""}`}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => { set("password")(e); if (errors.password) setErrors((p) => ({ ...p, password: null })); }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
              </button>
            </div>
            {form.password && strength && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength.level ? strength.color : "var(--surface-4)" }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {errors.password && (
              <span className="form-error">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <i className="ti ti-lock-check input-icon" aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className={`form-control input-with-icon input-with-action${errors.confirmPassword ? " input-error" : ""}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) => { set("confirmPassword")(e); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: null })); }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                <i className={`ti ${showConfirm ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="form-error">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Creating account...
              </>
            ) : (
              <>
                <i className="ti ti-user-plus" aria-hidden="true" />
                Create account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}