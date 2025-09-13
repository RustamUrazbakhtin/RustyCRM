import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";
import "./Auth.css";

type Mode = "signin" | "signup";

export default function AuthLanding() {
    const [mode, setMode] = useState<Mode>("signin");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signin, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") || "");
        const password = String(fd.get("password") || "");
        const confirm = String(fd.get("confirm") || "");
        const firstName = String(fd.get("firstName") || "");
        const lastName = String(fd.get("lastName") || "");
        const companyName = String(fd.get("companyName") || "");

        try {
            if (mode === "signup") {
                if (password !== confirm) throw new Error("Passwords do not match");
                await signup(email, password, firstName || undefined, lastName || undefined, companyName || undefined);
            } else {
                await signin(email, password);
            }
            navigate("/app", { replace: true });
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-shell">
                <div className="brand">
                    <div className="logo-dot" />
                    <span className="brand-title">RustyCRM</span>
                </div>

                <div className="glass-card">
                    <div className="segmented">
                        <button className={`seg-btn ${mode === "signin" ? "active" : ""}`} onClick={() => setMode("signin")} type="button">Sign In</button>
                        <button className={`seg-btn ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")} type="button">Sign Up</button>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <form className="form" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <>
                                <label className="field">
                                    <span>First name</span>
                                    <input name="firstName" placeholder="John" />
                                </label>
                                <label className="field">
                                    <span>Last name</span>
                                    <input name="lastName" placeholder="Smith" />
                                </label>
                                <label className="field">
                                    <span>Company</span>
                                    <input name="companyName" placeholder="Acme Inc." />
                                </label>
                            </>
                        )}

                        <label className="field">
                            <span>Email</span>
                            <input name="email" type="email" placeholder="name@company.com" required />
                        </label>

                        <label className="field">
                            <span>Password</span>
                            <input name="password" type="password" placeholder="Your password" minLength={6} required />
                        </label>

                        {mode === "signup" && (
                            <label className="field">
                                <span>Confirm password</span>
                                <input name="confirm" type="password" placeholder="Re-enter password" minLength={6} required />
                            </label>
                        )}

                        {mode === "signin" && (
                            <div className="row between">
                                <label className="checkbox">
                                    <input type="checkbox" name="remember" />
                                    <span>Remember me</span>
                                </label>
                                <a className="muted" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                            </div>
                        )}

                        <button className="primary-btn" type="submit">
                            {mode === "signin" ? "Sign In" : "Create Account"}
                        </button>
                    </form>
                </div>

                <p className="footer muted">© {new Date().getFullYear()} RustyCRM</p>
            </div>
        </div>
    );
}
