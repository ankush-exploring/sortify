import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { DetailSkeleton } from "../components/Skeleton";

function StatusPill({ status }) {
  const map = {
    TODO: { style: "border border-[var(--border)] text-[var(--text-secondary)]" },
    IN_PROGRESS: { style: "bg-[var(--shade-3)] text-white" },
    RESOLVED: { style: "text-[var(--text-secondary)] line-through" },
    CLOSED: { style: "text-[var(--text-secondary)]" },
  };
  const s = map[status] || map.TODO;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${s.style}`}>
      {status ? status.replace(/_/g, " ") : "TODO"}
    </span>
  );
}

function PriorityPill({ priority }) {
  const map = {
    critical: { style: "bg-[var(--pill-critical-fill)] text-[var(--pill-critical-text)]" },
    high: { style: "bg-[var(--pill-high-fill)] text-[var(--pill-high-text)]" },
    medium: { style: "border border-[var(--pill-medium-border)] text-[var(--pill-medium-text)]" },
    low: { style: "text-[var(--pill-low-text)]" },
  };
  const p = map[priority] || map.medium;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${p.style}`}>
      {priority === "critical" && <span className="text-[8px]">&#9679;</span>}
      {priority === "high" && <span className="text-[8px]">&#9650;</span>}
      {priority === "medium" && <span className="text-[8px]">&#8212;</span>}
      {priority === "low" && <span className="text-[8px]">&#9660;</span>}
      {priority || "medium"}
    </span>
  );
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
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
      <Link to="/" className="mt-4 inline-block text-sm text-[var(--text-primary)] underline underline-offset-2">Back to tickets</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to tickets
      </Link>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            {ticket.title}
          </h1>
          <div className="flex gap-2 flex-shrink-0">
            <StatusPill status={ticket.status} />
            <PriorityPill priority={ticket.priority} />
          </div>
        </div>

        <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-6">
          {ticket.description}
        </p>

        {ticket.helpfulNotes && (
          <div className="mb-6 rounded-lg border-l-2 border-[var(--text-primary)] bg-[var(--bg-secondary)] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              AI Analysis
            </p>
            <div className="text-sm text-[var(--text-primary)] prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="border-t border-[var(--border)] pt-4 mt-6 space-y-2">
          {ticket.assignedTo?.email && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">Assigned to:</span>
              <span className="font-medium text-[var(--text-primary)]">{ticket.assignedTo.email}</span>
            </div>
          )}
          {ticket.relatedSkills?.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">Skills:</span>
              <div className="flex gap-1 flex-wrap">
                {ticket.relatedSkills.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {ticket.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">Deadline:</span>
              <span className="text-[var(--text-primary)]">{new Date(ticket.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {ticket.createdAt && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">Created:</span>
              <span className="text-[var(--text-primary)]">{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
