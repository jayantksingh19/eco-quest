import { apiFetch } from "./apiClient";

export type UserRole = "student" | "teacher";

export interface SchoolSummary {
  name?: string;
  code?: string;
}

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: SchoolSummary | null;
  profileImageUrl?: string | null;
  phoneNumber?: string;
  phoneVerified?: boolean;
  wantsNotifications?: boolean;
  address?: string;
}

export interface StudentUser extends BaseUser {
  role: "student";
  grade?: string;
  progress?: Record<string, unknown>;
}

export interface TeacherUser extends BaseUser {
  role: "teacher";
}

export type AuthUser = StudentUser | TeacherUser;

export interface StudentSummary {
  name: string;
  email: string;
  grade?: string;
  progress?: Record<string, unknown> | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  students?: StudentSummary[];
}

export interface AuthSession extends AuthResponse {}

export const AUTH_STORAGE_KEY = "ecoquest_session";
export const AUTH_CHANGED_EVENT = "ecoquest:auth-changed";

const isBrowser = typeof window !== "undefined";

const emitAuthChange = (session: AuthSession | null) => {
  if (!isBrowser) return;
  window.dispatchEvent(
    new CustomEvent<AuthSession | null>(AUTH_CHANGED_EVENT, { detail: session })
  );
};

export const getStoredSession = (): AuthSession | null => {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.token === "string") {
      return parsed as AuthSession;
    }
    return null;
  } catch (error) {
    console.warn("Failed to parse auth session", error);
    return null;
  }
};

export const storeSession = (session: AuthSession | null) => {
  if (!isBrowser) return;
  window.localStorage.removeItem("ecoquest_user");
  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    emitAuthChange(null);
    return;
  }
  const payload: AuthSession = {
    token: session.token,
    user: session.user,
    students: session.students,
  };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  emitAuthChange(payload);
};

export const clearSession = () => storeSession(null);

export const persistAuthResponse = (response: AuthResponse) => {
  const session: AuthSession = {
    token: response.token,
    user: response.user,
    students: response.students,
  };
  storeSession(session);
  return session;
};

export const updateStoredSessionUser = (user: AuthUser) => {
  const current = getStoredSession();
  if (!current) return null;
  const updatedSession: AuthSession = {
    token: current.token,
    user,
    students: current.students,
  };
  storeSession(updatedSession);
  return updatedSession;
};

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export const login = async (payload: LoginPayload) => {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
  return persistAuthResponse(response);
};

export interface TeacherRegistrationPayload {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  schoolCode: string;
}

export const registerTeacher = async (payload: TeacherRegistrationPayload) => {
  const response = await apiFetch<AuthResponse>("/auth/register/teacher", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
  return persistAuthResponse(response);
};

export interface StudentRegistrationPayload {
  name: string;
  email: string;
  password: string;
  grade: string;
  schoolCode: string;
}

export const registerStudent = async (payload: StudentRegistrationPayload) => {
  const response = await apiFetch<AuthResponse>("/auth/register/student", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
  return persistAuthResponse(response);
};

export const fetchProfile = async () => {
  const response = await apiFetch<{ user: AuthUser }>("/auth/me", {
    method: "GET",
  });
  updateStoredSessionUser(response.user);
  return response.user;
};

export interface UpdateProfilePayload {
  name?: string;
  profileImageUrl?: string | null;
  wantsNotifications?: boolean;
  address?: string | null;
  phoneNumber?: string | null;
  grade?: string | null;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await apiFetch<{ user: AuthUser }>("/auth/me", {
    method: "PUT",
    body: payload,
  });
  updateStoredSessionUser(response.user);
  return response.user;
};

export interface SendPhoneOtpPayload {
  phoneNumber: string;
}

export const sendPhoneOtp = async (payload: SendPhoneOtpPayload) => {
  return apiFetch<{ message: string; expiresAt?: string; channel?: "sms" | "email" }>(
    "/auth/phone/send-otp",
    {
      method: "POST",
      body: payload,
    },
  );
};

export interface VerifyPhoneOtpPayload {
  code: string;
}

export const verifyPhoneOtp = async (payload: VerifyPhoneOtpPayload) => {
  const response = await apiFetch<{ user: AuthUser; message: string }>(
    "/auth/phone/verify",
    {
      method: "POST",
      body: payload,
    },
  );
  updateStoredSessionUser(response.user);
  return response;
};

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const updatePassword = async (payload: UpdatePasswordPayload) => {
  return apiFetch<{ message: string }>("/auth/me/password", {
    method: "PUT",
    body: payload,
  });
};

export interface RequestLoginOtpPayload {
  identifier: string;
}

export interface LoginOtpRequestResponse {
  message: string;
  channel: "sms" | "email";
  expiresAt?: string;
}

export const requestLoginOtp = async (payload: RequestLoginOtpPayload) => {
  return apiFetch<LoginOtpRequestResponse>("/auth/login/request-otp", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
};

export interface VerifyLoginOtpPayload {
  identifier: string;
  code: string;
}

export const verifyLoginOtp = async (payload: VerifyLoginOtpPayload) => {
  const response = await apiFetch<AuthResponse>("/auth/login/verify-otp", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
  return persistAuthResponse(response);
};

export interface RequestPasswordResetPayload {
  identifier: string;
}

export interface PasswordResetOtpResponse {
  message: string;
  channels: Array<"sms" | "email">;
  expiresAt?: string;
}

export const requestPasswordResetOtp = async (payload: RequestPasswordResetPayload) => {
  return apiFetch<PasswordResetOtpResponse>("/auth/password/request-otp", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
};

export interface ResetPasswordWithOtpPayload {
  identifier: string;
  code: string;
  newPassword: string;
}

export const resetPasswordWithOtp = async (payload: ResetPasswordWithOtpPayload) => {
  return apiFetch<{ message: string }>("/auth/password/reset", {
    method: "POST",
    withAuth: false,
    body: payload,
  });
};
