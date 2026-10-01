import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("adminToken"));

  // If there is no token, immediately route to login without buffering
  if (!hasToken && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only show loading spinner if verifying an existing token session
  if (loading && hasToken && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
