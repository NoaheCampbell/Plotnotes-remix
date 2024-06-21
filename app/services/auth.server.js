// app/services/auth.server.js
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { Authenticator } from "remix-auth";
import { getSession, commitSession, destroySession } from "./session.server.js";

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
const authenticator = new Authenticator({
  getSession,
  commitSession,
  destroySession
});

// Callback function that will be invoked upon successful authentication from social provider
async function handleSocialAuthCallback({ profile }) {
  // Create user in your db here
  // Profile object contains all the user data like image, displayName, id
  return profile;
}

// Configuring Google Strategy
authenticator.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid email profile"],
    callbackURL: `http://localhost:5173/auth/${SocialsProvider.GOOGLE}/callback`,
  },
  handleSocialAuthCallback
));

export { authenticator };
