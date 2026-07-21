import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

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

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.tickets || data || [];
      setTickets(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(tickets.filter((t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)));
  }, [search, tickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", description: "" });
        setShowForm(false);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tickets</h1>
        <button onClick={() => setShowForm(!showForm)} className="text-sm px-3 py-1.5 rounded-md bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]">
          {showForm ? "Cancel" : "New ticket"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-[var(--border)] rounded-md space-y-3">
          <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
          <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required rows={3}
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] resize-none" />
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="text-sm px-3 py-1.5 rounded-md bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input type="text" placeholder="Search tickets…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
      </div>

      {loading ? (
        <div className="space-y-2"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No tickets" description={search ? "Try a different search." : "Create your first ticket."} />
      ) : (
        <div className="border border-[var(--border)] rounded-md divide-y divide-[var(--border)]">
          {filtered.map((ticket) => (
            <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block px-4 py-3 hover:bg-[var(--table-hover)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{ticket.title}</h3>
                    <StatusPill status={ticket.status} />
                    <PriorityPill priority={ticket.priority} />
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--text-secondary)] line-clamp-1">{ticket.description}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    #{ticket._id?.slice(-6)} opened {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ""}
                    {ticket.assignedTo?.email ? ` · ${ticket.assignedTo.email}` : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
