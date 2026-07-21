import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protected: protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          <span className="text-sm text-[var(--text-secondary)]">Loading...</span>
        </div>
      </div>
    );
  }
  return children;
}

export default CheckAuth;
