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

function ConfirmDialog({ title, text, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">{title}</div>
        <p className="dialog-text">{text}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTicketDetail() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/api/admin/tickets/${ticket_id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setNotes(res.data.notes || "");
    } catch (err) {
      const msg = err.response?.status === 404 ? "Ticket not found." : "Failed to load ticket.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [ticket_id]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await API.put(`/api/admin/tickets/${ticket_id}`, { status, notes });
      setTicket(res.data);
      toast("Ticket updated successfully!", "success");
    } catch (err) {
      toast(err.response?.data?.detail || "Failed to update ticket.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/api/admin/tickets/${ticket_id}`);
      toast("Ticket deleted.", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      toast(err.response?.data?.detail || "Failed to delete ticket.", "error");
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const isDirty = ticket && (status !== ticket.status || notes !== (ticket.notes || ""));

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
        <Link to="/admin/dashboard" className="back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Ticket Not Found</div>
          <p className="empty-state-text">{error || "This ticket does not exist."}</p>
          <Link to="/admin/dashboard" className="btn btn-secondary" style={{ marginTop: 16 }}>
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete Ticket?"
          text={`This will permanently delete ticket ${ticket.ticket_id}. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      <main className="crm-main">
        <Link to="/admin/dashboard" className="back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
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

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* Main */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Customer Info */}
            <div className="card" style={{ padding: 24 }}>
              <h3 className="card-title">Customer Information</h3>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                <div>
                  <div className="field-label">Name</div>
                  <div className="field-value">{ticket.customer_name}</div>
                </div>
                <div>
                  <div className="field-label">Email</div>
                  <div className="field-value">{ticket.customer_email}</div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="card" style={{ padding: 24 }}>
              <h3 className="card-title">Details</h3>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                <div>
                  <div className="field-label">Subject</div>
                  <div className="field-value">{ticket.subject}</div>
                </div>
                <div>
                  <div className="field-label">Description</div>
                  <div className="field-value" style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</div>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="card" style={{ padding: 24 }}>
              <h3 className="card-title">Admin Controls</h3>
              <div style={{ display: "grid", gap: 16, marginTop: 12 }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Internal Notes</label>
                  <textarea
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={6}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleUpdate}
                    disabled={!isDirty || saving}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {saving ? (
                      <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</>
                    ) : (
                      <><i className="ti ti-device-floppy" style={{ fontSize: 15 }} aria-hidden="true" /> Save Changes</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={deleting}
                    className="btn btn-danger"
                  >
                    <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: 24 }}>
              <h3 className="card-title">Metadata</h3>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                <div>
                  <div className="field-label">Created</div>
                  <div className="field-value">{formatDateTime(ticket.created_at)}</div>
                </div>
                <div>
                  <div className="field-label">Updated</div>
                  <div className="field-value">{formatDateTime(ticket.updated_at)}</div>
                </div>
                <div>
                  <div className="field-label">Current Status</div>
                  <div style={{ marginTop: 8 }}><StatusBadge status={ticket.status} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}