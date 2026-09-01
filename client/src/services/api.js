const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong.");
  return payload;
};

export const carApi = {
  list: (params = "") => api(`/cars${params}`),
  get: (id) => api(`/cars/${id}`),
  add: (body) => api("/cars/add", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => api(`/cars/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => api(`/cars/${id}`, { method: "DELETE" }),
};

export const authApi = {
  login: (body) => api("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => api("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  googleLogin: (body) => api("/auth/google", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => api("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => api("/auth/me"),
  logout: () => api("/auth/logout", { method: "POST" }),
};

export const paymentApi = {
  demoOrder: (body) => api("/payment/demo-order", { method: "POST", body: JSON.stringify(body) }),
};

export const usersApi = {
  list: () => api("/users"),
  updateRole: (id, role) => api(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
};

export const profileApi = {
  get: () => api("/profile"),
  update: (body) => api("/profile", { method: "PUT", body: JSON.stringify(body) }),
};

export const dashboardApi = {
  stats: () => api("/dashboard"),
};

export const reviewApi = {
  list: (carId) => api(`/reviews/${carId}`),
  add: (body) => api("/reviews/add", { method: "POST", body: JSON.stringify(body) }),
};
