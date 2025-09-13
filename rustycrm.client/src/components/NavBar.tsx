import { useAuth } from "../auth/auth-context";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
    const { user, signout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #eee", background: "#fff" }}>
            <Link to="/calendar" style={{ fontWeight: 800, color: "#111827", textDecoration: "none" }}>RustyCRM</Link>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#374151" }}>{user?.email}</span>
                <button
                    onClick={() => { signout(); navigate("/", { replace: true }); }}
                    style={{ border: 0, background: "#ef4444", color: "#fff", padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
