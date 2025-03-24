# GitHub Authentication - Passport.js Setup

## Install Dependencies
```sh
npm install express passport passport-github2 express-session dotenv
```

## Setup Passport with GitHub

### 1. Create a GitHub OAuth App
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Register a new OAuth application
  - **Homepage URL:** `http://localhost:5173`
  - **Callback URL:** `http://localhost:5000/auth/github/callback`
- Save `Client ID` and `Client Secret` in `.env` file

### 2. Configure Backend
#### Add `.env` File
```sh
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_session_secret
```

#### Implement Authentication in `server.js`
```js
import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
      scope: ["repo", "user"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
```

## Authentication Flow
1. **User clicks** `Login with GitHub` on frontend.
2. Redirects to GitHub for authentication.
3. On success, GitHub redirects to `/auth/github/callback`.
4. Server retrieves access token and stores it in session.
5. Redirects user to frontend dashboard.
6. Frontend fetches repositories using the stored access token.

