export interface ApiErrorShape {
  message?: string;
  [key: string]: unknown;
}

export class ApiError<T extends ApiErrorShape = ApiErrorShape> extends Error {
  status: number;
  data: T;

  constructor(message: string, status: number, data: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const normalizeBaseUrl = (value?: string) => {
  if (!value) return undefined;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const DEFAULT_BASE_URL = "http://localhost:8923/api";

export const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) ?? DEFAULT_BASE_URL;

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /**
   * When true (default), the active auth token will be added automatically.
   */
  withAuth?: boolean;
  /**
   * Use a specific token instead of the stored one.
   */
  tokenOverride?: string | null;
  body?: unknown;
}

export type ApiResponse<T> = Promise<T>;

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== "undefined" && value instanceof Blob;

const isArrayBufferLike = (value: unknown): value is ArrayBuffer | ArrayBufferView => {
  if (typeof ArrayBuffer === "undefined") return false;
  return value instanceof ArrayBuffer || ArrayBuffer.isView(value as ArrayBufferView);
};

const isURLSearchParams = (value: unknown): value is URLSearchParams =>
  typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams;

const shouldSerializeToJson = (value: unknown) => {
  if (value == null) return false;
  if (typeof value === "string") return false;
  if (isFormData(value)) return false;
  if (isBlob(value)) return false;
  if (isArrayBufferLike(value)) return false;
  if (isURLSearchParams(value)) return false;
  return true;
};

const buildHeaders = (headers: HeadersInit | undefined, body: unknown) => {
  const finalHeaders = new Headers(headers ?? {});

  if (body && shouldSerializeToJson(body) && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return finalHeaders;
};

const resolveSessionToken = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("ecoquest_session");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.token === "string" ? parsed.token : null;
  } catch (error) {
    console.warn("Failed to parse stored session", error);
    return null;
  }
};

const resolveUrl = (path: string) => {
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { withAuth = true, tokenOverride = null, body, ...rest } = options;

  const finalBody =
    body == null
      ? undefined
      : shouldSerializeToJson(body)
        ? JSON.stringify(body)
        : (body as BodyInit);

  const headers = buildHeaders(rest.headers, body);

  if (withAuth) {
    const token = tokenOverride ?? resolveSessionToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(resolveUrl(path), {
    ...rest,
    body: finalBody,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && typeof payload?.message === "string"
        ? payload.message
        : typeof payload === "string" && payload
          ? payload
          : "Request failed") ?? "Request failed";

    throw new ApiError(message, response.status, payload ?? {});
  }

  return payload as T;
}
