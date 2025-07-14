import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3001/api/auth/google/callback";

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error(
    "Missing Google OAuth environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI"
  );
}

export const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

export const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export { clientId };
