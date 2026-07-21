import { useEffect, useState } from "react";
import { TableSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const navItems = [
  { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
  { id: "tickets", label: "Tickets", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "roles", label: "Roles", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const statusFilters = ["All", "Users", "Moderators", "Admins"];

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("users");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let list = [...users];
    if (activeFilter !== "All") {
      const role = activeFilter.toLowerCase().slice(0, -1);
      list = list.filter((u) => u.role === role);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => u.email.toLowerCase().includes(q));
    }
    setFilteredUsers(list);
  }, [searchQuery, activeFilter, users]);

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({ role: user.role, skills: user.skills?.join(", ") || "" });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }
      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u._id)));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-[var(--bg-primary)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] pt-16 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                activeNav === item.id
                  ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar with mobile menu toggle */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[var(--border)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] lg:hidden"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Users</h1>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-4 pb-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-[var(--accent)] text-[var(--accent-text)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 py-3">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
          />
        </div>

        {/* Table */}
        <div className="px-4 sm:px-6 pb-6 overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              description={searchQuery ? "Try a different search." : "No users registered yet."}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="w-10 py-3 px-2 text-left">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                    />
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Email</th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Role</th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Skills</th>
                  <th className="py-3 px-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--table-hover)] ${
                      editingUser === user.email ? "bg-[var(--table-hover)]" : ""
                    }`}
                  >
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user._id)}
                        onChange={() => toggleSelect(user._id)}
                        className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                      />
                    </td>
                    <td className="py-3 px-3 text-[var(--text-primary)] font-medium">{user.email}</td>
                    <td className="py-3 px-3">
                      {editingUser === user.email ? (
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          user.role === "admin"
                            ? "bg-[var(--shade-3)] text-white"
                            : user.role === "moderator"
                            ? "border border-[var(--border)] text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingUser === user.email ? (
                        <input
                          type="text"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          placeholder="Comma-separated"
                          className="w-full text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none"
                        />
                      ) : (
                        <div className="flex gap-1 flex-wrap">
                          {user.skills?.length > 0
                            ? user.skills.map((s) => (
                                <span key={s} className="text-xs px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)]">
                                  {s}
                                </span>
                              ))
                            : <span className="text-[var(--text-secondary)]">—</span>}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {editingUser === user.email ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={handleUpdate}
                            className="text-xs px-2 py-1 rounded bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-xs px-2 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
