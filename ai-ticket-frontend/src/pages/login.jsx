import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      if (!baseUrl) {
        alert("Server URL not configured. Please set VITE_SERVER_URL.");
        return;
      }
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.error || data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.25rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign in to Sortify</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
          <button type="submit" disabled={loading}
            className="w-full py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-[var(--text-secondary)]">
          New to Sortify? <Link to="/signup" className="text-[var(--text-primary)] hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
