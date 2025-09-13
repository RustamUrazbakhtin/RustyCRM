// src/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-context";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
    return user ? <>{children}</> : <Navigate to="/" replace />;
}
