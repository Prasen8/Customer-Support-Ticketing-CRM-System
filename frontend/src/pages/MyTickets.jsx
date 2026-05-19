import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ number, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-number" style={{ color }}>{number}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High:   { bg: "rgba(239,68,68,0.15)",  color: "#f87171", border: "rgba(239,68,68,0.3)" },
    Medium: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
    Low:    { bg: "rgba(34,197,94,0.15)",  color: "#4ade80", border: "rgba(34,197,94,0.3)" },
  };
  const s = map[priority] || map.Low;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {priority || "Low"}
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap",
      fontSize: 12, fontWeight: 500,
      background: "rgba(255,255,255,0.07)",
      color: "var(--text-muted)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <i className="ti ti-tag" style={{ fontSize: 11 }} />
      {category || "Other"}
    </span>
  );
}

export default function MyTickets() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ticketsRes = await API.get("/api/tickets/my-tickets", {
        params: { search: search || undefined, status: status || undefined },
      });
      setTickets(ticketsRes.data);
      const total = ticketsRes.data.length;
      const open = ticketsRes.data.filter((t) => t.status === "Open").length;
      const inProgress = ticketsRes.data.filter((t) => t.status === "In Progress").length;
      const closed = ticketsRes.data.filter((t) => t.status === "Closed").length;
      setStats({ total, open, in_progress: inProgress, closed });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to load tickets";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchTickets, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchTickets]);

  const handleLogout = () => {
    logout();
    toast("Logged out successfully", "success");
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="crm-main">
        <div className="loading-center"><div className="spinner" /></div>
      </main>
    );
  }

  const thBase = {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
    borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
    background: "rgba(255,255,255,0.02)",
  };

  const tdBase = {
    padding: "13px 16px",
    fontSize: 14,
    color: "var(--text-primary)",
    verticalAlign: "middle",
    borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
  };

  return (
    <main className="crm-main">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Support Tickets</h1>
          <p className="page-subtitle">
            Hello, <strong>{user?.username}</strong>. View and manage your support requests.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/create-ticket" className="btn btn-primary">
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            New Ticket
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            <i className="ti ti-logout" style={{ fontSize: 15 }} aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <StatCard number={stats.total} label="Total" color="var(--text-primary)" />
          <StatCard number={stats.open} label="Open" color="var(--status-open)" />
          <StatCard number={stats.in_progress} label="In Progress" color="var(--status-progress)" />
          <StatCard number={stats.closed} label="Closed" color="var(--status-closed)" />
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            placeholder="Search your tickets…"
            className="form-control search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ minWidth: 160 }}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No Tickets Found</div>
          <p className="empty-state-text">
            {error ? error : "You haven't created any support tickets yet."}
          </p>
          <Link to="/create-ticket" className="btn btn-primary" style={{ marginTop: 16 }}>
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            Create Your First Ticket
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "120px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "90px" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={thBase}>Ticket ID</th>
                <th style={thBase}>Subject</th>
                <th style={thBase}>Category</th>
                <th style={thBase}>Priority</th>
                <th style={thBase}>Status</th>
                <th style={thBase}>Created</th>
                <th style={{ ...thBase, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, i) => (
                <tr
                  key={ticket.ticket_id}
                  style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                >
                  <td style={tdBase}>
                    <span className="ticket-card-id" style={{ fontSize: 12 }}>
                      {ticket.ticket_id}
                    </span>
                  </td>
                  <td style={{
                    ...tdBase,
                    maxWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}>
                    {ticket.subject}
                  </td>
                  <td style={tdBase}>
                    <CategoryBadge category={ticket.category} />
                  </td>
                  <td style={tdBase}>
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td style={tdBase}>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td style={{ ...tdBase, color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>
                    {formatDate(ticket.created_at)}
                  </td>
                  <td style={{ ...tdBase, textAlign: "right" }}>
                    <Link to={`/ticket/${ticket.ticket_id}`} className="btn btn-sm btn-secondary">
                      <i className="ti ti-eye" style={{ fontSize: 13 }} aria-hidden="true" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}