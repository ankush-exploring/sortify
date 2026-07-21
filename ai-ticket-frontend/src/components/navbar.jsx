import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) user = JSON.parse(user);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="px-4 h-13 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-base font-semibold text-[var(--text-primary)]">
          Sortify
        </Link>
        <div className="flex items-center gap-3">
          {token ? (
            <>
              {user?.role === "admin" && (
                <Link to="/admin" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  Admin
                </Link>
              )}
              <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">{user?.email}</span>
              <button onClick={logout} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Login
              </Link>
              <Link to="/signup" className="text-sm px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--btn-hover)]">
                Sign up
              </Link>
            </>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-hover)]">
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
