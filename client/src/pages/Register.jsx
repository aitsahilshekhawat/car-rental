import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { authApi } from "../services/api";
import { saveMember } from "../services/session";
import { Field, AuthLayout } from "./shared";

export function Register() {
  const navigate = useNavigate(); 
  const [error, setError] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  
  const register = async (event) => { 
    event.preventDefault(); 
    setError(""); 
    
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (password.length <= 6) {
      setError("Password must be more than 6 characters.");
      return;
    }

    setSubmitting(true); 
    try { 
      const result = await authApi.register({ 
        name: `${form.get("firstName")} ${form.get("lastName") || ""}`.trim(), 
        email: email.trim(), 
        password: password 
      }); 
      saveMember(result.user); 
      navigate("/user-dashboard"); 
    } catch (registerError) { 
      setError(registerError.message); 
    } finally { 
      setSubmitting(false); 
    } 
  };

  return (
    <AuthLayout title="Let's get you going." copy="A few details and you'll be ready to find your next drive." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form className="auth-form" onSubmit={register}>
        <div className="form-grid">
          <Field label="First name"><input name="firstName" placeholder="First name" required /></Field>
          <Field label="Last name (Optional)"><input name="lastName" placeholder="Last name" /></Field>
        </div>
        <Field label="Email address" icon={Mail}><input name="email" type="email" placeholder="you@example.com" required /></Field>
        <Field label="Create a password" icon={Lock}><input name="password" type="password" placeholder="More than 6 characters" required minLength="7" /></Field>
        <label className="terms-check"><input type="checkbox" required /> <span>I agree to DriveOn's <Link to="/terms">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</span></label>
        {error && <p className="auth-error" style={{marginTop: "10px", color: "#e74c3c", fontSize: "13px", fontWeight: "500"}}>{error}</p>}
        <button className="button button-dark button-full" disabled={submitting}>{submitting ? "Creating account\u2026" : <>Create account <ArrowRight size={17} /></>}</button>
      </form>
      <div className="or-divider"><span>or</span></div>
      <button className="social-login" type="button" onClick={() => {
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
              setError(err.message || "Google sign-up failed.");
            } finally {
              setSubmitting(false);
            }
          },
        });
        window.google.accounts.id.prompt();
      }} disabled={submitting}><span className="google-letter">G</span> Sign up with Google</button>
    </AuthLayout>
  );
}
