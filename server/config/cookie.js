// H1: Shared cookie configuration for JWT HttpOnly cookies
const isProduction = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,                       // Not accessible via JavaScript
  secure: isProduction,                 // HTTPS only in production
  sameSite: isProduction ? "none" : "lax", // Cross-site in production (for separate frontend/backend domains)
  maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days (matches JWT expiry)
  path: "/",
};

export const setTokenCookie = (res, token) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

export const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};
