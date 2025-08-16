import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from 'express-session';
import globalErrorHandler from './middleware/GlobalErrorHandler.js';
import userRouter from './user/userRouter.js';
import postRouter from './post/postRouter.js';
import jobRouter from './Job/jobRouter.js';
import chatRouter from './chat/chatRouter.js';
import { config } from './config/config.js';
import userProfileRouter from './userProfile/userProfileRouter.js';

const app = express();

// Parse JSON
app.use(express.json());

app.use("/api/chat", chatRouter);

// --- Session & Passport Setup ---
app.use(session({
  secret: 'your-secret-key', // Move to .env in future
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Example: find or create user in your DB
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  ));

// Serialize & deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// --- Google OAuth Routes ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? `Hello, ${req.user.displayName}` : 'Please log in');
});

// --- API Routes ---
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/users/profile', userProfileRouter);

// --- Global Error Handler ---
app.use(globalErrorHandler);

export default app;
