const MEMBER_KEY = "driveon-member";

export function getMember() {
  try {
    return JSON.parse(window.localStorage.getItem(MEMBER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveMember(member) {
  const safeMember = {
    _id: member._id || member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    profilePicture: member.profilePicture || "",
  };
  window.localStorage.setItem(MEMBER_KEY, JSON.stringify(safeMember));
  window.dispatchEvent(new Event("driveon-member-change"));
}

export function clearMember() {
  window.localStorage.removeItem(MEMBER_KEY);
  window.dispatchEvent(new Event("driveon-member-change"));
}
