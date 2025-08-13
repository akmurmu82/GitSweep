import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors";
import axios from "axios";
dotenv.config();
console.log(process.env.BACKEND_URL)
const app = express();
const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
const client = process.env.CLIENT || "http://localhost:5173";
console.log("client:", client)
const port = process.env.PORT || 8080;

app.use(cors({ origin: client, credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${backendUrl}/auth/github/callback`,
            scope: ["repo", "delete_repo", "user"],
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, { profile, accessToken });
        }
    )
);

app.get("/", (req, res) => {
    res.send({ message: "✅ GitHub Auth API (stateless mode)" });
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const token = req.user.accessToken;
        const username = req.user.profile.username;
        // console.log("token", token)

        // res.cookie("accessToken", token, {
        //     httpOnly: true,
        //     sameSite: "lax", // change to "none" + secure:true if HTTPS + cross-site
        //     secure: false,   // true in production HTTPS
        // });
        res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });


        console.log(`🔑 GitHub Login: ${username}`);
        res.redirect(`${client}/dashboard`);
    }
);

app.get("/auth/user", async (req, res) => {
    // 1. Try to extract the access token from cookies
    const token = req.cookies?.accessToken;
    // console.log("🔍 [DEBUG] The req:",req)
    console.log("🔍 [DEBUG] Extracted cookies:",req.cookies)
    console.log("🔍 [DEBUG] Extracted token from cookies:", token);

    // 2. If no token is found, respond with unauthorized
    if (!token) {
        console.warn("⚠️ [WARN] No access token found in cookies.");
        return res.status(401).json({ isLoggedIn: false, message: "Access token missing" });
    }

    try {
        // 3. Make a request to GitHub API to fetch the user's profile
        const response = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${token}` },
        });

        console.log("✅ [INFO] GitHub user fetched successfully:", response.data.login);

        // 4. Send user data and login status
        res.json({ user: response.data, isLoggedIn: true });

    } catch (error) {
        // 5. If token is invalid or request fails
        console.error("❌ [ERROR] Failed to fetch GitHub user:", error.response?.data || error.message);
        res.status(401).json({ isLoggedIn: false, error: "Failed to fetch user" });
    }
});

// app.get("/auth/user", async (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", client);
//     res.setHeader("Access-Control-Allow-Credentials", "true");

//     const token = req.cookies?.token; // FIX: use "token" instead of "accessToken"
//     if (!token) return res.status(401).json({ isLoggedIn: false });

//     try {
//         const response = await axios.get("https://api.github.com/user", {
//             headers: { Authorization: `token ${token}` },
//         });

//         res.json({ user: response.data, isLoggedIn: true });
//     } catch (error) {
//         res.status(401).json({ isLoggedIn: false, error: "Failed to fetch user" });
//     }
// });


app.get("/repos", async (req, res) => {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ error: "No token found" });

    try {
        const response = await axios.get(
            "https://api.github.com/user/repos?per_page=100",
            {
                headers: { Authorization: `token ${token}` },
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "GitHub API error" });
    }
});

app.get("/auth/logout", (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "lax",
        secure: false, // match your cookie config
    });
    res.redirect(client);
});

app.listen(port, () => console.log(`🚀 Server running on ${port}`));
