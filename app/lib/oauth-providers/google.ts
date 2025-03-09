// app/lib/oauth-providers/google.ts
import { OAuth2Client } from "google-auth-library";

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const generateAuthUrl = (state: string) => {
  return oauthClient.generateAuthUrl({
    scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/userinfo.profile"],
    state,
  });
};

export const getTokenFromCode = async (code: string) => {
  const { tokens } = await oauthClient.getToken(code);
  if (!tokens.id_token) {
    throw new Error("Failed to retrieve ID token.");
  }

  const payload = await oauthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const idTokenBody = payload.getPayload();
  if (!idTokenBody) {
    throw new Error("Failed to retrieve user profile.");
  }

  console.log("ID Token Payload:", idTokenBody);

  return {
    email: idTokenBody.email!,
    name: idTokenBody.name || idTokenBody.given_name || idTokenBody.family_name || "Unknown User",
    googleId: idTokenBody.sub!,
    picture: idTokenBody.picture, // Include profile picture URL
  };
};