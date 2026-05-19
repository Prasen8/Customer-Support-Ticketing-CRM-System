import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isCustomer } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="crm-header">
      {/* Brand */}
      <Link to={isAdmin ? "/admin/dashboard" : "/my-tickets"} className="crm-header-brand" style={{ textDecoration: "none" }}>
        <div className="crm-header-icon">🎫</div>
        <span className="crm-header-title">
          Support<span>CRM</span>
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isCustomer && (
          <>
            <Link
              to="/my-tickets"
              className="btn btn-ghost btn-sm"
              style={
                location.pathname === "/my-tickets"
                  ? { color: "var(--text-primary)", background: "var(--surface-2)" }
                  : {}
              }
            >
              My Tickets
            </Link>
            <Link to="/create-ticket" className="btn btn-primary btn-sm">
              + New Ticket
            </Link>
          </>
        )}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="btn btn-ghost btn-sm"
            style={
              location.pathname === "/admin/dashboard"
                ? { color: "var(--text-primary)", background: "var(--surface-2)" }
                : {}
            }
          >
            Dashboard
          </Link>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {user?.username}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
