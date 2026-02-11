// Simple hardcoded auth. No DB. Two logins: Admin and Participant (common).

export type UserRole = "participant" | "admin";

export type User = { role: "admin" } | { role: "participant" };

const CREDENTIALS: Record<string, string> = {
  admin: "nimda",
  participant: "join",
};

export function validateLogin(roleOrAdmin: string, password: string): User | null {
  const key = roleOrAdmin.toLowerCase().replace(/\s+/g, "");
  const expected = CREDENTIALS[key];
  if (!expected || expected !== password) return null;
  if (key === "admin") return { role: "admin" };
  if (key === "participant") return { role: "participant" };
  return null;
}

export const LOGIN_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "participant", label: "Participant" },
] as const;

export const AUTH_STORAGE_KEY = "calfus-game-user";

export function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as User;
    if (data.role === "admin") return { role: "admin" };
    if (data.role === "participant") return { role: "participant" };
    return null;
  } catch {
    return null;
  }
}

export function saveUserToStorage(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearUserFromStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
