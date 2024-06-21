import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { Authenticator } from "remix-auth";
import { getSession, commitSession, destroySession } from "./session.server.js";
import { query } from "../utils/pool.js";
import { request } from "express";
import crypto from 'crypto';

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
  
    // Check if user exists
    let result = await query('SELECT * FROM users WHERE email = $1', [profile.emails[0].value]);
    let user = result.rows[0];
    
    if (!user) {
      // Create user if not exists
      result = await query(
        'INSERT INTO users (email, displayname, avatarurl) VALUES ($1, $2, $3) RETURNING *',
        [profile.emails[0].value, profile.displayName, profile.photos[0].value]
      );
      user = result.rows[0];
    }
  
    // Create session through request
    const session = await getSession(request.headers.cookie); 
    
    // Set user id and create sessionid for session
    session.set('userid', user.userid);
    session.set('sessionid', crypto.randomBytes(16).toString('hex'));
    // Save session to cookie
    commitSession(session);
    // Save session to database
    await query(
      'INSERT INTO sessions (sessionid, userid, expiresat) VALUES ($1, $2, $3)',
      [session.get('sessionid'), user.userid, new Date(Date.now() + 1000 * 60 * 60 * 24)] // 1 day expiration
    );
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
