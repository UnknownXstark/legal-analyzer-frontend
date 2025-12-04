// src/api/authClient.js
import { BASE_URL } from "@/utils/config";

const API_BASE_URL = BASE_URL.replace("/api/", "");

export async function refreshTokenFetch(refreshToken) {
  if (!refreshToken) throw new Error("No refresh token");
  const res = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Refresh failed");
  }
  return res.json();
}
