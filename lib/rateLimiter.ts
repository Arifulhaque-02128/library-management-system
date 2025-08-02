type AttemptData = {
  count: number;
  lastAttempt: number;
};

// rate limiting store
const attemptStore: Record<string, AttemptData> = {};

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 2;


//  Returns true if rate limited, false otherwise.

export function isRateLimited(key: string): { limited: boolean; message?: string } {
  const now = Date.now();
  const attempt = attemptStore[key];

  if (!attempt) {
    attemptStore[key] = { count: 1, lastAttempt: now };
    return { limited: false };
  }

  const timeSinceLast = now - attempt.lastAttempt;

  if (timeSinceLast > WINDOW_MS) {
    attemptStore[key] = { count: 1, lastAttempt: now };
    return { limited: false };
  }

  attempt.count += 1;
  attempt.lastAttempt = now;

  if (attempt.count > MAX_ATTEMPTS) {
    return { limited: true, message: "Too many sign-in attempts. Please try again after a minute." };
  }

  return { limited: false };
}


//  reset after success
 
export function resetAttempts(key: string): void {
  delete attemptStore[key];
}
