import express from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './middleware/GlobalErrorHandler.js';
import userRouter from './user/userRouter.js';
import { googleStrategy } from './config/googleAuth.js';

const app = express();

// Parse JSON
app.use(express.json());

// --- Session & Passport Setup ---
app.use(session({
  secret: 'your-secret-key', // Move to .env in future
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(googleStrategy);

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

// --- Global Error Handler ---
app.use(globalErrorHandler);

export default app;
