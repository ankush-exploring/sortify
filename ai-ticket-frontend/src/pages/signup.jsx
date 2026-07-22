import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) {
      alert("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }
    if (!baseUrl) {
      alert("Server URL not configured. Please set VITE_SERVER_URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.error || "Failed to send code");
      }
    } catch (err) {
      console.error("Send code error:", err);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, code }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.25rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-semibold text-center mb-6">Create your account</h1>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-3">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)]" />
            <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 cursor-pointer accent-[var(--accent)]" />
              <span>I agree to the <Link to="/terms" target="_blank" className="text-[var(--text-primary)] hover:underline">Terms & Conditions</Link></span>
            </label>
            <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 cursor-pointer accent-[var(--accent)]" />
              <span>I agree to the <Link to="/privacy" target="_blank" className="text-[var(--text-primary)] hover:underline">Privacy Policy</Link></span>
            </label>
            <button type="submit" disabled={loading || !agreeTerms || !agreePrivacy}
              className="w-full py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
              {loading ? "Sending code…" : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)] text-center">
              A 6-digit code was sent to <span className="font-medium text-[var(--text-primary)]">{form.email}</span>
            </p>
            <input type="text" inputMode="numeric" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] text-center text-lg tracking-widest" />
            <button type="submit" disabled={loading || code.length !== 6}
              className="w-full py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50">
              {loading ? "Creating account…" : "Verify & Sign Up"}
            </button>
            <button type="button" onClick={() => setStep(1)} disabled={loading}
              className="w-full py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              ← Change email
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-center text-[var(--text-secondary)]">
          Already have an account? <Link to="/login" className="text-[var(--text-primary)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
