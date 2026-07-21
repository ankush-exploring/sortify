import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
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
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] mb-6">
            Create your account
          </h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--text-primary)] underline underline-offset-2 hover:opacity-70 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
