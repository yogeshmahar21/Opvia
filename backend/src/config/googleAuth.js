import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config.js'; // config.js contains your credentials

export const googleStrategy = new GoogleStrategy(
  {
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: 'http://localhost:5000/auth/google/callback', // Update for production
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you can save/find the user in your DB
    return done(null, profile);
  }
);
