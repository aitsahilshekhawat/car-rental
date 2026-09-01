import { useState, useEffect } from "react";
import { Clock3, MoreHorizontal, Search, Upload } from "lucide-react";
import PageShell from "../components/Layout";
import { PortalLayout } from "../components/Portal";
import { usersApi } from "../services/api";
import { getMember } from "../services/session";

export function ManageUsers() { 
  const member = getMember() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionMenuId, setActionMenuId] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.list()
      .then(data => setUsers(data.users || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    setError("");
    try {
      await usersApi.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setActionMenuId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatJoined = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  const getInitials = (name) => name.split(' ').map(n => n[0] || '').join('').substring(0, 2).toUpperCase() || "U";

  const getRoleActions = (targetUser) => {
    if (targetUser._id === member._id) return [];
    const callerRole = member.role;
    const targetRole = targetUser.role;
    const actions = [];
    if (callerRole === "manager") {
      if (targetRole === "user") {
        actions.push({ label: "Promote to Admin", role: "admin" });
        actions.push({ label: "Promote to Manager", role: "manager" });
      } else if (targetRole === "admin") {
        actions.push({ label: "Demote to User", role: "user" });
        actions.push({ label: "Promote to Manager", role: "manager" });
      } else if (targetRole === "manager") {
        actions.push({ label: "Demote to Admin", role: "admin" });
        actions.push({ label: "Demote to User", role: "user" });
      }
    } else if (callerRole === "admin") {
      if (targetRole === "user") {
        actions.push({ label: "Promote to Admin", role: "admin" });
      }
    }
    return actions;
  };

  return <PageShell footer={false}><PortalLayout title="Members" eyebrow="ADMIN SPACE" type="admin" action={<button className="button button-outline"><Upload size={16} /> Export CSV</button>}>
    {error && <p style={{ color: "#e74c3c", marginBottom: "16px", fontSize: "14px", fontWeight: 500 }}>{error}</p>}
    <div className="users-toolbar">
      <div className="users-search"><Search size={17} /><input placeholder="Search members" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
      <select className="filter-trigger" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ appearance: "auto", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
        <option value="all">All roles</option>
        <option value="user">Users</option>
        <option value="admin">Admins</option>
        <option value="manager">Managers</option>
      </select>
    </div>
    <section className="panel user-table"><table><thead><tr><th>Member</th><th>Role</th><th>Joined</th><th>Email</th><th>Provider</th><th></th></tr></thead><tbody>
      {loading ? <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>Loading users...</td></tr> :
       filteredUsers.length === 0 ? <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>No users found</td></tr> :
       filteredUsers.map(u => {
         const actions = getRoleActions(u);
         const isMe = u._id === member._id;
         return <tr key={u._id}>
           <td><span className="avatar blue">{getInitials(u.name)}</span><span><strong>{u.name}{isMe ? " (You)" : ""}</strong><small>{u.email}</small></span></td>
           <td><span className={`role-pill ${u.role}`} style={{ textTransform: "capitalize" }}>{u.role}</span></td>
           <td>{formatJoined(u.createdAt)}</td>
           <td><small>{u.email}</small></td>
           <td><small style={{ textTransform: "capitalize" }}>{u.authProvider || "local"}</small></td>
           <td style={{ position: "relative" }}>
             {actions.length > 0 && <button className="more-button" onClick={() => setActionMenuId(actionMenuId === u._id ? null : u._id)} disabled={updating === u._id}>{updating === u._id ? <Clock3 size={20} /> : <MoreHorizontal size={20} />}</button>}
             {actionMenuId === u._id && <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 10, minWidth: "180px", overflow: "hidden" }}>
               {actions.map(a => <button key={a.role} onClick={() => handleRoleChange(u._id, a.role)} style={{ display: "block", width: "100%", padding: "10px 16px", border: "none", background: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", fontWeight: 500 }} onMouseOver={e => e.target.style.background = "#f5f5f5"} onMouseOut={e => e.target.style.background = "none"}>{a.label}</button>)}
             </div>}
           </td>
         </tr>;
       })}
    </tbody></table></section>
  </PortalLayout></PageShell>; 
}
