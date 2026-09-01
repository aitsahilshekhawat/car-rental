import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { authApi } from "../services/api";
import { saveMember } from "../services/session";
import { Field, AuthLayout } from "./shared";

export function Login() {
  const navigate = useNavigate(); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  const login = async (event) => { event.preventDefault(); setError(""); setSubmitting(true); const form = new FormData(event.currentTarget); try { const result = await authApi.login({ email: form.get("email"), password: form.get("password") }); saveMember(result.user); navigate((result.user.role === "admin" || result.user.role === "manager") ? "/dashboard" : "/user-dashboard"); } catch (loginError) { setError(loginError.message); } finally { setSubmitting(false); } };
  
  const handleGoogleLogin = () => {
    setError("");
    if (!window.google) {
      setError("Google Sign-In is loading. Please try again in a moment.");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: "789992146214-m9o5v87mun658b7a70pggpaom379ifre.apps.googleusercontent.com",
      callback: async (response) => {
        try {
          setSubmitting(true);
          const result = await authApi.googleLogin({ credential: response.credential });
          saveMember(result.user);
          navigate((result.user.role === "admin" || result.user.role === "manager") ? "/dashboard" : "/user-dashboard");
        } catch (err) {
          setError(err.message || "Google sign-in failed.");
        } finally {
          setSubmitting(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  return <AuthLayout title="Welcome back." copy="Good to see you again. Let's get you moving." footer={<>New to DriveOn? <Link to="/register">Create an account</Link></>}><form className="auth-form" onSubmit={login}><Field label="Email address" icon={Mail}><input name="email" type="email" placeholder="Email address" /></Field><Field label="Password" icon={Lock}><input name="password" type="password" placeholder="Password" /></Field><div className="remember-row"><label><input type="checkbox" /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>{error && <p className="auth-error">{error}</p>}<button className="button button-dark button-full" disabled={submitting}>{submitting ? "Logging in\u2026" : <>Log in <ArrowRight size={17} /></>}</button></form><div className="or-divider"><span>or</span></div><button className="social-login" type="button" onClick={handleGoogleLogin} disabled={submitting}><span className="google-letter">G</span> Continue with Google</button></AuthLayout>;
}
