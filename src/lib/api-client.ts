const APP_CODE =
  process.env.NEXT_PUBLIC_APP_CODE ?? process.env.VITE_APP_CODE ?? "SALONDNHT";

const IDENTITY_BASE_URL =
  process.env.NEXT_PUBLIC_API_IDENTITY ??
  process.env.VITE_API_IDENTITY ??
  "https://api.identity.app.riviu.com.vn";

// const SALON_BASE_URL =
//   process.env.NEXT_PUBLIC_API_SALON ??
//   process.env.VITE_API_SALON ??
//   "https://api.salon.dnht.dev.eggstech.io";
const SALON_BASE_URL =
  process.env.NEXT_PUBLIC_API_SALON ??
  process.env.VITE_API_SALON ??
  "http://localhost:5000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  [key: string]: unknown;
};

export type AuthUser = {
  id: string;
  name: string;
  scope: string;
  exp: number;
  iss: string;
  [key: string]: unknown;
};

type ApiRequestOptions = {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

type IdentityLoginPayload = {
  username: string;
  password: string;
};

const memoryTokenStore: { accessToken?: string; refreshToken?: string } = {};

const isBrowser = typeof window !== "undefined";

const tokenStorage = {
  setTokens: (tokens: TokenResponse) => {
    memoryTokenStore.accessToken = tokens.accessToken;
    memoryTokenStore.refreshToken = tokens.refreshToken;

    if (isBrowser && window.localStorage) {
      window.localStorage.setItem("accessToken", tokens.accessToken);
      window.localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  },
  getAccessToken: (): string | undefined => {
    if (memoryTokenStore.accessToken) {
      return memoryTokenStore.accessToken;
    }

    if (isBrowser && window.localStorage) {
      const token = window.localStorage.getItem("accessToken") ?? undefined;
      memoryTokenStore.accessToken = token;
      return token;
    }

    return undefined;
  },
  getRefreshToken: (): string | undefined => {
    if (memoryTokenStore.refreshToken) {
      return memoryTokenStore.refreshToken;
    }

    if (isBrowser && window.localStorage) {
      const token = window.localStorage.getItem("refreshToken") ?? undefined;
      memoryTokenStore.refreshToken = token;
      return token;
    }

    return undefined;
  },
  clear: () => {
    memoryTokenStore.accessToken = undefined;
    memoryTokenStore.refreshToken = undefined;

    if (isBrowser && window.localStorage) {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    }
  },
};

const ensureSuccessStatus = async (response: Response) => {
  if (response.ok) {
    return;
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    // ignore
  }

  const error: Error & { status?: number; payload?: unknown } = new Error(
    `Request failed with status ${response.status}`
  );
  error.status = response.status;
  error.payload = payload;

  throw error;
};

export const identityApi = {
  /**
   * Gọi API đăng nhập tới Identity, lưu accessToken và refreshToken.
   *
   * @param payload { username, password }
   * @param loginPath path login tương đối, ví dụ: "/auth/login"
   */
  login: async (
    payload: IdentityLoginPayload,
    loginPath: string = "/auth/login"
  ): Promise<TokenResponse> => {
    const url = `${IDENTITY_BASE_URL}${loginPath}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appCode: APP_CODE,
      },
      body: JSON.stringify(payload),
    });

    await ensureSuccessStatus(response);

    const raw = (await response.json()) as any;

    // Hỗ trợ cả 2 dạng: { accessToken, refreshToken } hoặc { data: { accessToken, refreshToken }, meta: {...} }
    const tokenData = (raw?.data ?? raw) as Partial<TokenResponse>;

    if (!tokenData.accessToken || !tokenData.refreshToken) {
      throw new Error("Login response does not contain tokens");
    }

    const tokens: TokenResponse = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
    };

    tokenStorage.setTokens(tokens);

    return tokens;
  },

  /**
   * Hàm helper chung để gọi các API Identity khác, luôn kèm header appCode.
   */
  request: async <TResponse = unknown>({
    method = "GET",
    path,
    body,
    headers,
  }: ApiRequestOptions): Promise<TResponse> => {
    const url = `${IDENTITY_BASE_URL}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        appCode: APP_CODE,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    await ensureSuccessStatus(response);

    return (await response.json()) as TResponse;
  },
};

const decodeJwt = (token?: string): AuthUser | null => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = isBrowser
      ? window.atob(padded)
      : Buffer.from(padded, "base64").toString("binary");

    const data = JSON.parse(json) as AuthUser;
    return data;
  } catch {
    return null;
  }
};

export const salonApi = {
  /**
   * Gọi API salon với accessToken dạng Bearer token.
   *
   * Ví dụ:
   * salonApi.request({ method: "POST", path: "/admin/project", body: {...} })
   */
  request: async <TResponse = unknown>({
    method = "GET",
    path,
    body,
    headers,
  }: ApiRequestOptions): Promise<TResponse> => {
    const url = `${SALON_BASE_URL}${path}`;
    const accessToken = tokenStorage.getAccessToken();

    const authHeaders: Record<string, string> = {};
    if (accessToken) {
      authHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    await ensureSuccessStatus(response);

    // Một số API có thể trả về 204 No Content
    if (response.status === 204) {
      return {} as TResponse;
    }

    return (await response.json()) as TResponse;
  },

  get: <TResponse = unknown>(path: string, headers?: Record<string, string>) =>
    salonApi.request<TResponse>({ method: "GET", path, headers }),

  post: <TResponse = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => salonApi.request<TResponse>({ method: "POST", path, body, headers }),

  put: <TResponse = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => salonApi.request<TResponse>({ method: "PUT", path, body, headers }),

  del: <TResponse = unknown>(path: string, headers?: Record<string, string>) =>
    salonApi.request<TResponse>({ method: "DELETE", path, headers }),
};

export const authToken = {
  getAccessToken: tokenStorage.getAccessToken,
  getRefreshToken: tokenStorage.getRefreshToken,
  clear: tokenStorage.clear,
};

export const authUser = {
  getCurrentUser: (): AuthUser | null =>
    decodeJwt(tokenStorage.getAccessToken()),
};
