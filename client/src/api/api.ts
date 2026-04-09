const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  let headers: Record<string, string> = { "Content-Type": "application/json" };

  // ... (behåll din header-logik här) ...
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }
  }

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  // --- LOGIK FÖR TOKEN EXPIRED / REFRESH ---
  if (res.status === 401) {
    console.log("Access token expired, refreshing...");

    try {
      const refresh = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refresh.ok) {
        // Om refresh misslyckas (t.ex. cookien är borta/överskriven)
        throw new Error("Refresh failed");
      }

      const data = await refresh.json();
      setAccessToken(data.accessToken);

      // Gör om ursprungsanropet med ny token
      headers["Authorization"] = `Bearer ${data.accessToken}`;
      res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
      });
    } catch (err) {
      // --- FIX FÖR DITT PROBLEM: FORCE LOGOUT ---
      console.error("Session helt ogiltig. Loggar ut användare...", err);
      setAccessToken("");

      // Skicka användaren till loginsidan och ladda om för att rensa all state
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=true";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const rawResponse = await res.text();
    let errorMessage = `Network error: ${res.status}`;

    try {
      const errorData = JSON.parse(rawResponse);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (rawResponse) errorMessage = rawResponse;
    }

    console.error("API error:", res.status, errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
};
