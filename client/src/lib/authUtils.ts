export function getLoginUrl() {
  return `/api/login?redirect=${window.location.pathname}`;
}

export function getSignupUrl() {
  return `/api/signup?redirect=${window.location.pathname}`;
}

export function getLogoutUrl() {
  return `/api/logout`;
}

export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected authentication error occurred";
}
