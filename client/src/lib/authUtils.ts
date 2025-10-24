export function getLoginUrl() {
  return `/login?redirect=${window.location.pathname}`;
}

export function getSignupUrl() {
  return `/signup?redirect=${window.location.pathname}`;
}

export function getLogoutUrl() {
  return `/logout`;
}

export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected authentication error occurred";
}
