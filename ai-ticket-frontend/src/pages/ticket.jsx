import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { DetailSkeleton } from "../components/Skeleton";

function StatusPill({ status }) {
  const map = {
    TODO: "border border-[var(--border)] text-[var(--text-secondary)]",
    IN_PROGRESS: "bg-[var(--shade-3)] text-white",
    RESOLVED: "text-[var(--text-secondary)]",
    CLOSED: "text-[var(--text-secondary)]",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || map.TODO}`}>
      {status ? status.replace(/_/g, " ") : "TODO"}
    </span>
  );
}

function PriorityPill({ priority }) {
  const map = {
    critical: "bg-[var(--pill-critical-fill)] text-[var(--pill-critical-text)]",
    high: "bg-[var(--pill-high-fill)] text-[var(--pill-high-text)]",
    medium: "border border-[var(--pill-medium-border)] text-[var(--pill-medium-text)]",
    low: "text-[var(--pill-low-text)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${map[priority] || map.medium}`}>
      {priority === "critical" && <span className="text-[9px]">●</span>}
      {priority === "high" && <span className="text-[9px]">▲</span>}
      {priority === "low" && <span className="text-[9px]">▼</span>}
      {priority || "medium"}
    </span>
  );
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) user = JSON.parse(user);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTicket(data.ticket);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!ticket) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-[var(--text-secondary)]">Ticket not found</p>
      <Link to="/" className="mt-2 inline-block text-sm text-[var(--text-primary)] hover:underline">Back to tickets</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4">
        ← Back to tickets
      </Link>

      <div className="border border-[var(--border)] rounded-md p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold">{ticket.title}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusPill status={ticket.status} />
            <PriorityPill priority={ticket.priority} />
          </div>
        </div>
        {(user?.role === "admin" || ticket.createdBy === user?._id) && (
          <div className="flex justify-end -mt-2 mb-4">
            <button
              onClick={async () => {
                if (!confirm("Delete this ticket?")) return;
                setDeleting(true);
                try {
                  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (res.ok) navigate("/");
                  else alert("Failed to delete");
                } catch { alert("Something went wrong"); }
                finally { setDeleting(false); }
              }}
              disabled={deleting}
              className="text-xs text-[var(--text-secondary)] hover:text-red-500 transition-colors"
            >
              {deleting ? "Deleting…" : "Delete ticket"}
            </button>
          </div>
        )}

        <div className="text-sm text-[var(--text-primary)] leading-relaxed mb-6 whitespace-pre-wrap">
          {ticket.description}
        </div>

        {ticket.helpfulNotes && (
          <div className="mb-6 border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase mb-2">AI analysis</p>
            <div className="text-sm text-[var(--text-primary)] prose prose-sm max-w-none">
              <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="border-t border-[var(--border)] pt-4 mt-6 space-y-2 text-sm">
          {ticket.assignedTo?.email && (
            <p><span className="text-[var(--text-secondary)]">Assigned to:</span> <span className="font-medium">{ticket.assignedTo.email}</span></p>
          )}
          {ticket.relatedSkills?.length > 0 && (
            <p className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)]">Skills:</span>
              {ticket.relatedSkills.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)]">{s}</span>
              ))}
            </p>
          )}
          {ticket.createdAt && (
            <p><span className="text-[var(--text-secondary)]">Created:</span> {new Date(ticket.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
