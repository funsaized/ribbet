// Reject expired sessions before accepting a request.
export const sessionIsValid = (expiresAt: number, now: number) => expiresAt > now;
