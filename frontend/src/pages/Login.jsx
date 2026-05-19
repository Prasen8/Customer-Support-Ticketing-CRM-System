import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      const res = await API.post("/api/auth/login", form);
      const { access_token, user_id, username, role } = res.data;
      login(access_token, { id: user_id, username, role });
      toast(`Welcome back, ${username}!`, "success");
      navigate(role === "admin" ? "/admin/dashboard" : "/my-tickets");
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed. Please try again.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

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
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-wrapper">
              <i className="ti ti-user input-icon" aria-hidden="true" />
              <input
                id="username"
                type="text"
                className={`form-control input-with-icon${errors.username ? " input-error" : ""}`}
                placeholder="Enter your username"
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

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <i className="ti ti-lock input-icon" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control input-with-icon input-with-action${errors.password ? " input-error" : ""}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => { set("password")(e); if (errors.password) setErrors((p) => ({ ...p, password: null })); }}
                autoComplete="current-password"
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
            {errors.password && (
              <span className="form-error">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {errors.password}
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
                Signing in...
              </>
            ) : (
              <>
                <i className="ti ti-login" aria-hidden="true" />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}