const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address is invalid.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with these credentials.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/popup-blocked": "Popup blocked. Please allow popups and try again.",
  "auth/account-exists-with-different-credential":
    "An account already exists with a different sign-in method.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled for the project.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return MESSAGES[code] || "Something went wrong. Please try again.";
}
