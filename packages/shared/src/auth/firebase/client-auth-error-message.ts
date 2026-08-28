export default function authCodeToMessage(code: string): string {
  switch (code) {
    // Login / credentials
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-user-token":
      return "Invalid email or password.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/missing-email":
      return "Email address is required.";

    case "auth/missing-password":
      return "Password is required.";

    case "auth/weak-password":
      return "Your password must be stronger.";

    case "auth/email-already-in-use":
      return "An account with this email address already exists.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/requires-recent-login":
      return "Please sign in again to complete this action.";

    case "auth/user-token-expired":
      return "Your session has expired. Please sign in again.";

    case "auth/user-signed-out":
    case "auth/null-user":
      return "Please sign in to continue.";

    // Rate limit / network
    case "auth/too-many-requests":
    case "auth/quota-exceeded":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
    case "auth/timeout":
      return "Please check your internet connection and try again.";

    // Email verification / password reset links
    case "auth/expired-action-code":
    case "auth/invalid-action-code":
      return "This link is invalid or has expired.";

    case "auth/missing-continue-uri":
    case "auth/invalid-continue-uri":
    case "auth/unauthorized-continue-uri":
      return "The action link is invalid.";

    case "auth/unverified-email":
      return "Please verify your email address to continue.";

    // Phone authentication
    case "auth/invalid-phone-number":
      return "Please enter a valid phone number.";

    case "auth/missing-phone-number":
      return "Phone number is required.";

    case "auth/invalid-verification-code":
    case "auth/missing-verification-code":
      return "The verification code is invalid or missing.";

    case "auth/invalid-verification-id":
    case "auth/missing-verification-id":
      return "The verification session is invalid. Please try again.";

    // OAuth / popup
    case "auth/popup-blocked":
      return "The sign-in popup was blocked. Please check your browser settings.";

    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/redirect-cancelled-by-user":
    case "auth/user-cancelled":
      return "Sign-in was cancelled.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using another sign-in method.";

    case "auth/provider-already-linked":
      return "This sign-in method is already linked to your account.";

    case "auth/no-such-provider":
      return "This sign-in method is not linked to your account.";

    // MFA
    case "auth/multi-factor-auth-required":
      return "Additional verification is required to sign in.";

    case "auth/second-factor-already-in-use":
      return "This second-factor method is already registered.";

    case "auth/maximum-second-factor-count-exceeded":
      return "You cannot add any more second-factor methods.";

    // Browser / storage limitations
    case "auth/web-storage-unsupported":
    case "auth/operation-not-supported-in-this-environment":
      return "Your browser does not support this sign-in method.";

    // App / Firebase configuration errors
    case "auth/operation-not-allowed":
    case "auth/app-not-authorized":
    case "auth/app-not-installed":
    case "auth/unauthorized-domain":
    case "auth/invalid-api-key":
    case "auth/auth-domain-config-required":
    case "auth/invalid-app-id":
    case "auth/internal-error":
      return "An authentication error occurred. Please try again.";

    default:
      return "An authentication error occurred. Please try again.";
  }
}
