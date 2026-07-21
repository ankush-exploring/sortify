import { useEffect, useState } from "react";
import { TableSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const navItems = [
  { id: "users", label: "Users" },
  { id: "tickets", label: "Tickets" },
  { id: "roles", label: "Roles" },
];

const statusFilters = ["All", "Users", "Moderators", "Admins"];

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) { setUsers(data); setFiltered(data); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let list = [...users];
    if (activeFilter !== "All") {
      const role = activeFilter.toLowerCase().slice(0, -1);
      list = list.filter((u) => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.email.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [search, activeFilter, users]);

  const handleEdit = (user) => {
    setEditing(user.email);
    setFormData({ role: user.role, skills: user.skills?.join(", ") || "" });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: editing,
          role: formData.role,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setEditing(null);
        setFormData({ role: "", skills: "" });
        fetchUsers();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.25rem)]">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-56 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] pt-14 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--table-hover)]">
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-md text-[var(--text-secondary)] hover:bg-[var(--btn-hover)] lg:hidden" aria-label="Open sidebar">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold">Users</h1>
        </div>

        <div className="flex items-center gap-1 px-4 pt-3 pb-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md ${activeFilter === f ? "bg-[var(--bg-secondary)] font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="px-4 py-2">
          <input type="text" placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-3 py-1.5 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
        </div>

        <div className="px-4 pb-6 overflow-x-auto">
          {loading ? <TableSkeleton rows={6} /> : filtered.length === 0 ? (
            <EmptyState title="No users" description={search ? "Try a different search." : "No users registered yet."} />
          ) : (
            <div className="border border-[var(--border)] rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-[var(--text-secondary)]">Email</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-[var(--text-secondary)]">Skills</th>
                    <th className="py-2.5 px-4 text-right text-xs font-medium text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((user) => (
                    <tr key={user._id} className={`hover:bg-[var(--table-hover)] ${editing === user.email ? "bg-[var(--table-hover)]" : ""}`}>
                      <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{user.email}</td>
                      <td className="py-2.5 px-4">
                        {editing === user.email ? (
                          <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none">
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-[var(--shade-3)] text-white" : user.role === "moderator" ? "border border-[var(--border)]" : "text-[var(--text-secondary)]"}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {editing === user.email ? (
                          <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Comma-separated"
                            className="w-full text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none" />
                        ) : (
                          <div className="flex gap-1 flex-wrap">
                            {user.skills?.length > 0 ? user.skills.map((s) => (
                              <span key={s} className="text-xs px-1.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">{s}</span>
                            )) : <span className="text-[var(--text-secondary)]">—</span>}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {editing === user.email ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={handleUpdate} className="text-xs px-2 py-1 rounded bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]">Save</button>
                            <button onClick={() => setEditing(null)} className="text-xs px-2 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => handleEdit(user)} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
