import { useState, useEffect, useRef } from "react";
import { ArrowRight, Car, Check, CheckCircle2, MoreHorizontal, ShieldCheck, Trash, Upload } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { profileApi } from "../services/api";
import { getMember } from "../services/session";
import { Field } from "./shared";

export function Profile() { 
  const member = getMember() || {};
  const [editing, setEditing] = useState(false); 
  const [profileImg, setProfileImg] = useState(() => localStorage.getItem("profileImg") || member.profilePicture || null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(user => {
      const nameParts = (user.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.profilePicture && !localStorage.getItem("profileImg")) setProfileImg(user.profilePicture);
      if (user.createdAt) {
        const d = new Date(user.createdAt);
        setMemberSince(d.toLocaleString("default", { month: "long", year: "numeric" }));
      }
    }).catch(() => {
      // Fallback to member session data
      if (member.name) {
        setFirstName(member.name.split(" ")[0] || "");
        setLastName(member.name.split(" ").slice(1).join(" ") || "");
      }
      setEmail(member.email || "");
    }).finally(() => setLoading(false));
  }, []);
  
  const displayFirst = firstName || "Guest";
  const displayLast = lastName;
  const displayEmail = email || "";
  const initials = `${displayFirst[0] || ""}${displayLast[0] || ""}`.toUpperCase() || "U";

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setProfileImg(null);
  };

  const handleSave = async () => {
    setError("");
    if (firstName.trim() || lastName.trim() || email.trim() || phone.trim()) {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (firstName.trim() && !nameRegex.test(firstName.trim())) {
        setError("First name can only contain letters and spaces.");
        return;
      }
      if (lastName.trim() && !nameRegex.test(lastName.trim())) {
        setError("Last name can only contain letters and spaces.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.trim() && !emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      const mobileRegex = /^\d{10}$/;
      if (phone.trim() && !mobileRegex.test(phone.trim())) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }
    }

    if (profileImg) {
      localStorage.setItem("profileImg", profileImg);
    } else {
      localStorage.removeItem("profileImg");
    }

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await profileApi.update({ name: fullName || undefined, phone: phone.trim() || undefined });
    } catch (err) {
      console.error("Profile save error:", err);
    }
    
    setEditing(false);
  };

  const handleCancel = () => {
    profileApi.get().then(user => {
      const nameParts = (user.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.profilePicture) setProfileImg(localStorage.getItem("profileImg") || user.profilePicture || null);
    }).catch(() => {});
    setError("");
    setEditing(false);
  };

  if (loading) return <PageShell footer={false}><PortalLayout title="Your profile" eyebrow="PERSONAL DETAILS"><p style={{ textAlign: "center", padding: "50px", color: "#999" }}>Loading profile...</p></PortalLayout></PageShell>;

  return <PageShell footer={false}><PortalLayout title="Your profile" eyebrow="PERSONAL DETAILS" action={<button className="button button-outline" onClick={() => editing ? handleCancel() : setEditing(true)}>{editing ? "Cancel" : "Edit profile"}</button>}><section className="profile-hero"><span className="profile-avatar" style={{ backgroundImage: profileImg ? `url(${profileImg})` : "none", backgroundSize: "cover", backgroundPosition: "center", color: profileImg ? "transparent" : "inherit" }}>
    {profileImg ? "" : initials}
    {editing && (
      !profileImg ? (
        <button onClick={() => fileInputRef.current.click()}><Upload size={15} /></button>
      ) : (
        <button onClick={handleImageDelete} style={{ background: '#e74c3c', borderColor: '#e74c3c' }}><Trash size={15} color="#fff" /></button>
      )
    )}
    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />
  </span><div><h2>{displayFirst} {displayLast}</h2><p>{displayEmail} \u00b7 <span>Verified member</span></p><small>Member since {memberSince || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</small></div></section><div className="profile-columns"><section className="panel profile-panel"><div className="panel-heading"><div><p className="eyebrow">BASIC INFORMATION</p><h3>About you</h3></div></div><div className="profile-fields"><Field label="First name"><input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!editing} /></Field><Field label="Last name"><input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!editing} /></Field><Field label="Email address" wide><input placeholder="Email address" value={email} disabled /></Field><Field label="Phone number" wide><input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} /></Field></div>{error && <p className="auth-error" style={{marginTop: "10px", color: "#e74c3c", fontSize: "13px", fontWeight: "500"}}>{error}</p>}{editing && <button className="button button-dark" onClick={handleSave} style={{marginTop: "15px"}}>Save changes <Check size={16} /></button>}</section><section className="panel profile-panel"><div className="panel-heading"><div><p className="eyebrow">DRIVER'S LICENCE</p><h3>Identity verification</h3></div><span className="verified"><CheckCircle2 size={15} /> Verified</span></div><div className="licence-card"><span><Car size={24} /></span><div><strong>Not added yet</strong><small>Add your driving licence</small></div><button className="more-button"><MoreHorizontal size={20} /></button></div><p className="panel-note"><ShieldCheck size={15} /> Your documents are encrypted and stored securely.</p></section></div></PortalLayout></PageShell>; 
}
