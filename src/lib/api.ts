const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5050/api";
const USER_EMAIL_STORAGE_KEY = "ieltsiq_active_email";

export function getActiveUserEmail() {
  if (typeof window === "undefined") return "learner@example.com";
  return localStorage.getItem(USER_EMAIL_STORAGE_KEY) || "learner@example.com";
}

export function setActiveUserEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("x-user-email", getActiveUserEmail());

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed for ${path}`);
  }

  return res.json();
}

export async function registerUser(data: {
  name: string;
  email: string;
  targetBand: number;
  currentLevel: string;
}) {
  const user = await apiFetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  setActiveUserEmail(user.email);
  return user;
}

export async function getSavedWords() {
  return apiFetch("/saved-words");
}

export async function addSavedWord(data: {
  word: string;
  meaning: string;
  level: string;
  status?: string;
}) {
  return apiFetch("/saved-words", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateSavedWord(id: number, status: string) {
  return apiFetch(`/saved-words/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

export async function deleteSavedWord(id: number) {
  return apiFetch(`/saved-words/${id}`, {
    method: "DELETE",
  });
}

export async function getDashboardData() {
  return apiFetch("/dashboard");
}

export async function getProfileData() {
  return apiFetch("/profile");
}

export async function updateProfile(data: {
  name: string;
  email: string;
  targetBand: number;
  currentLevel: string;
}) {
  const profile = await apiFetch("/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  setActiveUserEmail(profile.email);
  return profile;
}

export async function saveQuizResult(score: number, total: number) {
  return apiFetch("/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score, total }),
  });
}

export async function getMessages() {
  return apiFetch("/messages");
}

export async function sendMessage(content: string, mode: string = "general") {
  return apiFetch("/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, mode }),
  });
}
