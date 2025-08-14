import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors";
import axios from "axios";

const app = express();

// Environment configuration
const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
const client = process.env.CLIENT || "http://localhost:5173";
const port = process.env.PORT || 8080;

// console.log("🔧 Environment Configuration:");
// console.log("Backend URL:", backendUrl);
// console.log("Client URL:", client);
// console.log("Port:", port);

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
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "lax",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            // domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
        });


        console.log(`🔑 GitHub Login: ${username}`);
        res.redirect(`${client}/dashboard`);
    }
);

app.get("/auth/user", async (req, res) => {
    // 1. Try to extract the access token from cookies
    const token = req.cookies?.accessToken;
    console.log("🔍 [DEBUG] The req.cookies:",req.cookies)
    console.log("🔍 [DEBUG] Extracted cookies:", req.cookies)
    console.log("🔍 [DEBUG] Extracted token from cookies:", token);

    // 2. If no token is found, respond with unauthorized
    if (!token) {
        console.warn("⚠️ [WARN] No access token found in cookies.");
        return res.status(401).json({ isLoggedIn: false, message: "Access token missing", cookie: req.cookies });
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
    if (!token) {
        console.warn("⚠️ [WARN] No access token found for /repos request");
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const response = await axios.get(
            "https://api.github.com/user/repos?per_page=100",
            {
                headers: { Authorization: `token ${token}` },
            }
        );

        console.log(`✅ [INFO] Successfully fetched ${response.data.length} repositories`);
        res.json(response.data);
    } catch (error) {
        console.error("❌ [ERROR] GitHub API error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            res.status(401).json({ error: "Invalid or expired token" });
        } else if (error.response?.status === 403) {
            res.status(403).json({ error: "Access forbidden - insufficient permissions" });
        } else if (error.response?.status >= 500) {
            res.status(502).json({ error: "GitHub service unavailable" });
        } else {
            res.status(500).json({ error: "Failed to fetch repositories" });
        }
    }
});

// Add a new endpoint for deleting repositories
app.delete("/repos/:owner/:repo", async (req, res) => {
    const token = req.cookies?.accessToken;
    const { owner, repo } = req.params;

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const response = await axios.delete(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { Authorization: `token ${token}` },
        });

        console.log(`✅ [INFO] Successfully deleted repository: ${owner}/${repo}`);
        res.status(204).send();
    } catch (error) {
        console.error(`❌ [ERROR] Failed to delete repository ${owner}/${repo}:`, error.response?.data || error.message);

        if (error.response?.status === 401) {
            res.status(401).json({ error: "Invalid or expired token" });
        } else if (error.response?.status === 403) {
            res.status(403).json({ error: "Access forbidden - you may not have permission to delete this repository" });
        } else if (error.response?.status === 404) {
            res.status(404).json({ error: "Repository not found" });
        } else {
            res.status(500).json({ error: "Failed to delete repository" });
        }
    }
});

app.get("/auth/logout", (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "lax",
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
    });
    res.redirect(client);
});

app.listen(port, () => console.log(`🚀 Server running on ${port}`));
