import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function createSession() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return response.json();
}

export async function uploadDocuments(
  sessionId: string,
  files: File[]
) {
  const headers = await getAuthHeaders();

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/documents`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Failed to upload documents"
    );
  }

  return response.json();
}

export async function indexDocuments(sessionId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/index`,
    {
      method: "POST",
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Failed to index documents"
    );
  }

  return response.json();
}

export async function sendMessage(
  sessionId: string,
  question: string
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/chat`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Failed to send message"
    );
  }

  return response.json();
}

export async function getSessions() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/sessions`, {
    headers,
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Failed to fetch sessions"
    );
  }

  return response.json();
}

export async function getChatHistory(sessionId: string) {
  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/chat`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to load chat history"
    );
  }

  return response.json();
}

export async function deleteSession(sessionId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/sessions/${sessionId}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to delete conversation"
    );
  }

  return response.json();
}
