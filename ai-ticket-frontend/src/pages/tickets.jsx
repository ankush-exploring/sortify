import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

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

function Avatar({ email }) {
  const initial = email ? email[0].toUpperCase() : "?";
  return (
    <div className="w-7 h-7 rounded-full bg-[var(--shade-8)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)] flex-shrink-0">
      {initial}
    </div>
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
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.tickets || data || [];
      setTickets(list);
      setFiltered(list);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      tickets.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    );
  }, [search, tickets]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", description: "" });
        setShowForm(false);
        fetchTickets();
      } else {
        const data = await res.json();
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Tickets
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "+ New Ticket"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ticket title"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue..."
            required
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      )}

      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description={search ? "Try a different search term." : "Create your first ticket to get started."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--text-secondary)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {ticket.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusPill status={ticket.status} />
                    <PriorityPill priority={ticket.priority} />
                    {ticket.createdAt && (
                      <span className="text-xs text-[var(--text-secondary)]">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {ticket.assignedTo?.email && (
                  <Avatar email={ticket.assignedTo.email} />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
