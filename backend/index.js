import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(session({ secret: "github-secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/github/callback",
            scope: ["repo", "delete_repo", "user"], // Add "delete_repo" scope to delete repos
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, { profile, accessToken });
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get("/auth/github", passport.authenticate("github"));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        // Send accessToken to the frontend after login
        res.redirect(`http://localhost:5173/dashboard?token=${req.user.accessToken}`);
        // res.redirect("http://localhost:5173/dashboard"); // Redirect to frontend after login
    }
);

// Endpoint to get user's repositories
app.get("/repos", (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${req.user.accessToken}` },
    })
        .then((response) => response.json())
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json(err));
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
