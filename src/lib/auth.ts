// Simple hardcoded auth. No DB. Swap for real auth later.

export type UserRole = "team" | "admin";

export type User =
  | { role: "team"; teamId: string; teamName: string }
  | { role: "admin" };

const CREDENTIALS: Record<string, string> = {
  team1: "r7x2",
  team2: "k9m3",
  team3: "p4n8",
  team4: "z2b5",
  admin: "nimda",
};

const TEAM_NAMES: Record<string, string> = {
  team1: "Team 1",
  team2: "Team 2",
  team3: "Team 3",
  team4: "Team 4",
};

export function validateLogin(teamOrAdmin: string, password: string): User | null {
  const key = teamOrAdmin.toLowerCase().replace(/\s+/g, "");
  const expected = CREDENTIALS[key];
  if (!expected || expected !== password) return null;
  if (key === "admin") return { role: "admin" };
  // Map team1 -> team-1 for backend
  const teamId = key.replace(/^team(\d)$/, "team-$1");
  const teamName = TEAM_NAMES[key] ?? teamOrAdmin;
  return { role: "team", teamId, teamName };
}

export const LOGIN_OPTIONS = [
  { value: "team1", label: "Team 1" },
  { value: "team2", label: "Team 2" },
  { value: "team3", label: "Team 3" },
  { value: "team4", label: "Team 4" },
  { value: "admin", label: "Admin" },
] as const;

export const AUTH_STORAGE_KEY = "calfus-game-user";

export function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as User;
    if (data.role === "admin") return { role: "admin" };
    if (data.role === "team" && data.teamId && data.teamName)
      return { role: "team", teamId: data.teamId, teamName: data.teamName };
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
