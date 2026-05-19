import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function TicketDetail() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/api/tickets/${ticket_id}`);
      setTicket(res.data);
    } catch (err) {
      const msg = err.response?.status === 404 ? "Ticket not found." : "Failed to load ticket.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [ticket_id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/api/tickets/${ticket_id}`);
      toast("Ticket deleted.", "success");
      navigate("/my-tickets");
    } catch {
      toast("Failed to delete ticket.", "error");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <main className="crm-main">
        <div className="loading-center"><div className="spinner" /></div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="crm-main">
        <Link to="/my-tickets" className="back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Ticket Not Found</div>
          <p className="empty-state-text">{error || "This ticket does not exist."}</p>
          <Link to="/my-tickets" className="btn btn-secondary" style={{ marginTop: 16 }}>Go Home</Link>
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
        Back to Tickets
      </Link>

      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span className="ticket-card-id" style={{ fontSize: 13 }}>{ticket.ticket_id}</span>
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="page-title" style={{ fontSize: 22 }}>{ticket.subject}</h1>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleting}
        >
          <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
          Delete Ticket
        </button>
      </div>

      {/* Single-column detail card */}
      <div className="card detail-section">
        <h3 style={{
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em",
          color: "var(--text-muted)", fontWeight: 600, marginBottom: 4,
        }}>Ticket Details</h3>
        <div className="divider" style={{ marginTop: 10, marginBottom: 0 }} />

        <div className="detail-field">
          <span className="detail-field-label">Customer</span>
          <span className="detail-field-value">{ticket.customer_name}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Email</span>
          <span className="detail-field-value" style={{ color: "var(--brand-400)" }}>
            <a href={`mailto:${ticket.customer_email}`} style={{ color: "inherit", textDecoration: "none" }}>
              {ticket.customer_email}
            </a>
          </span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Description</span>
          <span className="detail-field-value" style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</span>
        </div>
        {ticket.notes && (
          <div className="detail-field">
            <span className="detail-field-label">Admin Notes</span>
            <span className="detail-field-value" style={{ whiteSpace: "pre-wrap" }}>{ticket.notes}</span>
          </div>
        )}
        <div className="detail-field">
          <span className="detail-field-label">Created</span>
          <span className="detail-field-value">{formatDateTime(ticket.created_at)}</span>
        </div>
        <div className="detail-field">
          <span className="detail-field-label">Last Updated</span>
          <span className="detail-field-value">{formatDateTime(ticket.updated_at)}</span>
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: 400, width: "90%", padding: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Delete Ticket?</h3>
            <p style={{ marginBottom: 20, color: "var(--text-muted)" }}>
              This action cannot be undone. The ticket will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}