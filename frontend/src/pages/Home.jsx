import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ number, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-number" style={{ color }}>
        {number}
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketsRes, statsRes] = await Promise.all([
        API.get("/api/tickets", { params: { search: search || undefined, status: status || undefined } }),
        API.get("/api/stats"),
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to load tickets. Is the backend running?";
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

  return (
    <main className="crm-main">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="page-subtitle">Manage and track all customer support requests</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          + New Ticket
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <StatCard number={stats.total}       label="Total"       color="var(--text-primary)" />
          <StatCard number={stats.open}        label="Open"        color="var(--status-open)" />
          <StatCard number={stats.in_progress} label="In Progress" color="var(--status-progress)" />
          <StatCard number={stats.closed}      label="Closed"      color="var(--status-closed)" />
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name, email, subject, or ID…"
            className="form-control search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          id="status-filter"
          className="form-control"
          style={{ width: "auto", minWidth: 150 }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Connection Error</div>
          <p className="empty-state-text">{error}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={fetchTickets}>
            Retry
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">
            {search || status ? "No matching tickets" : "No tickets yet"}
          </div>
          <p className="empty-state-text">
            {search || status
              ? "Try different search terms or clear filters."
              : "Create your first support ticket to get started."}
          </p>
          {!search && !status && (
            <Link to="/create" className="btn btn-primary" style={{ marginTop: 16 }}>
              Create First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <Link
              key={ticket.ticket_id}
              to={`/ticket/${ticket.ticket_id}`}
              className="ticket-card"
              style={{ textDecoration: "none" }}
            >
              <span className="ticket-card-id">{ticket.ticket_id}</span>

              <div className="ticket-card-body">
                <div className="ticket-card-subject">{ticket.subject}</div>
                <div className="ticket-card-meta">
                  <span>👤 {ticket.customer_name}</span>
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  <span>{ticket.customer_email}</span>
                </div>
              </div>

              <div className="ticket-card-right">
                <span className="ticket-card-date">{formatDate(ticket.created_at)}</span>
                <StatusBadge status={ticket.status} />
                <svg
                  width="16" height="16"
                  fill="none" viewBox="0 0 24 24"
                  stroke="var(--text-muted)" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
