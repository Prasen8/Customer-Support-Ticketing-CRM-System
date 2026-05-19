import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const CATEGORY_ICONS = {
  "Technical": "ti-cpu",
  "Billing": "ti-credit-card",
  "Account": "ti-user-circle",
  "Feature Request": "ti-bulb",
  "Performance": "ti-bolt",
  "Other": "ti-dots-circle-horizontal",
};

const PRIORITY_CONFIG = {
  "Low":    { color: "var(--status-closed)",   bg: "var(--status-closed-bg)",   border: "var(--status-closed-border)" },
  "Medium": { color: "var(--status-progress)", bg: "var(--status-progress-bg)", border: "var(--status-progress-border)" },
  "High":   { color: "var(--red-500)",         bg: "var(--red-bg)",             border: "rgba(239,68,68,0.35)" },
};

function PriorityBadge({ priority }) {
  if (!priority) return <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>;
  const c = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Low"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      color: c.color, background: c.bg,
      border: `1px solid ${c.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
      {priority}
    </span>
  );
}

function CategoryBadge({ category }) {
  if (!category) return <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>;
  const icon = CATEGORY_ICONS[category] || "ti-tag";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 500,
      color: "var(--text-secondary)",
      background: "var(--surface-3)",
      border: "1px solid var(--border-default)",
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 12 }} aria-hidden="true" />
      {category}
    </span>
  );
}

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes] = await Promise.all([
        API.get("/api/admin/tickets", { params: { status: statusFilter || undefined, search: search || undefined } }),
        API.get("/api/admin/stats"),
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch {
      toast("Failed to load tickets.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchData(); };

  const openTicket = (ticket) => {
    setSelected(ticket);
    setEditStatus(ticket.status);
    setEditNotes(ticket.notes || "");
  };

  const closeTicket = () => setSelected(null);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await API.put(`/api/admin/tickets/${selected.ticket_id}`, {
        status: editStatus,
        notes: editNotes,
      });
      setTickets((prev) => prev.map((t) => t.ticket_id === selected.ticket_id ? res.data : t));
      setSelected(res.data);
      toast("Ticket updated.", "success");
    } catch {
      toast("Failed to update ticket.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ticket_id) => {
    if (!window.confirm("Delete this ticket? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await API.delete(`/api/admin/tickets/${ticket_id}`);
      setTickets((prev) => prev.filter((t) => t.ticket_id !== ticket_id));
      setSelected(null);
      toast("Ticket deleted.", "success");
    } catch {
      toast("Failed to delete ticket.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <main className="crm-main">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            Logged in as <strong>{user?.username}</strong>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          <i className="ti ti-logout" style={{ fontSize: 15 }} aria-hidden="true" />
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label: "Total",       value: stats.total,       color: "var(--text-primary)" },
            { label: "Open",        value: stats.open,        color: "var(--status-open)" },
            { label: "In Progress", value: stats.in_progress, color: "var(--status-progress)" },
            { label: "Closed",      value: stats.closed,      color: "var(--status-closed)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-card-number" style={{ color }}>{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="search-wrapper" style={{ flex: 1 }}>
            <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input
              className="form-control search-input"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit" className="btn btn-primary">
            <i className="ti ti-search" style={{ fontSize: 15 }} aria-hidden="true" />
            Search
          </button>
        </form>
      </div>

      {/* Tickets Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="loading-center" style={{ padding: 40 }}><div className="spinner" /></div>
        ) : tickets.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-state-icon">🎫</div>
            <div className="empty-state-title">No tickets found</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Ticket ID", "Customer", "Subject", "Category", "Priority", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left", fontSize: 12,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    color: "var(--text-muted)", fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.ticket_id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <span className="ticket-card-id">{ticket.ticket_id}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{ticket.customer_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{ticket.customer_email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", maxWidth: 180 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14 }}>
                      {ticket.subject}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <CategoryBadge category={ticket.category} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatDateTime(ticket.created_at)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openTicket(ticket)}>
                        <i className="ti ti-eye" style={{ fontSize: 13 }} aria-hidden="true" />
                        View
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(ticket.ticket_id)}
                        disabled={deleting}
                      >
                        <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div className="card" style={{ width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>

            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <span className="ticket-card-id" style={{ fontSize: 12 }}>{selected.ticket_id}</span>
                <h2 style={{ fontSize: 18, marginTop: 8 }}>{selected.subject}</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={closeTicket}>
                <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
                Close
              </button>
            </div>

            {/* Category + Priority row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <CategoryBadge category={selected.category} />
              <PriorityBadge priority={selected.priority} />
              <StatusBadge status={selected.status} />
            </div>

            {/* Customer */}
            <div style={{
              background: "var(--surface-2)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 8 }}>
                Customer
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(79,110,247,0.12)",
                  border: "1px solid rgba(79,110,247,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "var(--brand-400)", flexShrink: 0,
                }}>
                  {selected.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{selected.customer_name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{selected.customer_email}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 6 }}>
                Description
              </div>
              <div style={{
                whiteSpace: "pre-wrap", fontSize: 14, color: "var(--text-secondary)",
                lineHeight: 1.6, background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)", padding: "12px 16px",
              }}>
                {selected.description}
              </div>
            </div>

            <div style={{ height: 1, background: "var(--border-subtle)", margin: "16px 0" }} />

            {/* Admin Controls */}
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 12 }}>
              Admin Controls
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Internal Notes</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Add notes..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving} style={{ flex: 1 }}>
                {saving ? (
                  <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</>
                ) : (
                  <><i className="ti ti-device-floppy" style={{ fontSize: 15 }} aria-hidden="true" /> Save Changes</>
                )}
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(selected.ticket_id)} disabled={deleting}>
                <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}