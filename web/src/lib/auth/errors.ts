type AuthError = { code?: string; message?: string; status?: number } | null | undefined;

const ALREADY_EXISTS = "Ин email аллакай ба қайд гирифта шудааст. Ворид шавед.";
const INVALID_CREDENTIALS = "Email ё парол нодуруст аст.";
const WEAK_PASSWORD = "Парол бояд ақаллан 8 аломат бошад.";
const TOO_MANY = "Кӯшишҳо зиёд шуданд. Пас аз як дақиқа боз кӯшиш кунед.";

/*
 * SDK-и @neondatabase/auth кодҳои Better Auth-ро ба кодҳои худ табдил медиҳад
 * (масалан, INVALID_EMAIL_OR_PASSWORD → invalid_credentials). Ҳарду шакл дастгирӣ мешаванд.
 */
const MESSAGES: Record<string, string> = {
  invalid_credentials: INVALID_CREDENTIALS,
  INVALID_EMAIL_OR_PASSWORD: INVALID_CREDENTIALS,
  user_already_exists: ALREADY_EXISTS,
  email_exists: ALREADY_EXISTS,
  USER_ALREADY_EXISTS: ALREADY_EXISTS,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: ALREADY_EXISTS,
  weak_password: WEAK_PASSWORD,
  PASSWORD_TOO_SHORT: WEAK_PASSWORD,
  email_address_invalid: "Email нодуруст навишта шудааст.",
  email_not_confirmed: "Аввал email-и худро тасдиқ кунед.",
  over_request_rate_limit: TOO_MANY,
};

/** Хатои Neon Auth-ро ба паёми фаҳмои тоҷикӣ табдил медиҳад. */
export function authErrorMessage(error: AuthError, fallback: string) {
  if (!error) return fallback;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.status === 429) return TOO_MANY;
  // Баъзе кодҳо (масалан, USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL) дар SDK харита надоранд ва танҳо паём мемонад
  if (/already exists/i.test(error.message ?? "")) return ALREADY_EXISTS;
  return fallback;
}
