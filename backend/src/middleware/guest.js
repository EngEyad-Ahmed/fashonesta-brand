import { randomUUID } from "node:crypto";

const GUEST_COOKIE = "fashionista_guest";
const GUEST_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

export function ensureGuest(req, res, next) {
  let guestId = req.cookies[GUEST_COOKIE];

  if (!guestId || !guestId.startsWith("guest-") || guestId.length > 50) {
    guestId = `guest-${randomUUID()}`;
    res.cookie(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_MAX_AGE,
    });
  }

  req.guestId = guestId;
  next();
}

export function resolveOwner(req) {
  return req.user ? req.user.id : req.guestId;
}