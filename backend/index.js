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

console.log("🔧 Environment Configuration:");
console.log("Backend URL:", backendUrl);
console.log("Client URL:", client);
console.log("Port:", port);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Enhanced CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // In development, allow the configured client
        if (process.env.NODE_ENV !== 'production') {
            if (origin === client) {
                return callback(null, true);
            }
        } else {
            // In production, be more flexible with subdomains
            const allowedOrigins = [
                client,
                // Add your actual production frontend URLs here
                'https://your-frontend-url.vercel.app',
                'https://your-frontend-url.netlify.app'
            ];
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
        }
        
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
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
        console.log("token", token)

        // Enhanced cookie configuration for production
        const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        };

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.sameSite = "None";
            cookieOptions.secure = true;
            // Don't set domain for Render.com - let it default
        } else {
            cookieOptions.sameSite = "lax";
            cookieOptions.secure = false;
        }
        res.cookie("accessToken", token, cookieOptions);

        console.log(`🍪 Cookie set with options:`, cookieOptions);

        console.log(`🔑 GitHub Login: ${username}`);
        // Redirect with token in URL for localStorage storage
        res.redirect(`${client}/auth/callback?token=${encodeURIComponent(token)}`);
    }
);

app.get("/auth/user", async (req, res) => {
    // 1. Try to extract the access token from cookies first, then from Authorization header
    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const token = headerToken || cookieToken;
    
    console.log("🔍 [DEBUG] Request headers:", req.headers);
    console.log("🔍 [DEBUG] Cookie header:", req.headers.cookie);
    console.log("🔍 [DEBUG] Parsed cookies:", req.cookies);
    console.log("🔍 [DEBUG] Authorization header:", req.headers.authorization);
    console.log("🔍 [DEBUG] Extracted token from cookies:", cookieToken);
    console.log("🔍 [DEBUG] Extracted token from header:", headerToken);
    console.log("🔍 [DEBUG] Final token used:", token?.substring(0, 10) + "...");

    // 2. If no token is found, respond with unauthorized
    if (!token) {
        console.warn("⚠️ [WARN] No access token found in cookies.");
        return res.status(401).json({ 
            isLoggedIn: false, 
            message: "Access token missing from both cookies and headers", 
            debug: {
                cookies: req.cookies,
                cookieHeader: req.headers.cookie,
                authHeader: req.headers.authorization,
                origin: req.headers.origin,
                userAgent: req.headers['user-agent']
            }
        });
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

app.get("/repos", async (req, res) => {
    console.log("🔎 [DEBUG] Incoming request to /repos with cookies:", req.cookies);

    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const token = headerToken || cookieToken;
    
    console.log("🔎 [DEBUG] Cookie token:", cookieToken?.substring(0, 10) + "...");
    console.log("🔎 [DEBUG] Header token:", headerToken?.substring(0, 10) + "...");
    console.log("🔎 [DEBUG] Final token used:", token?.substring(0, 10) + "...");

    if (!token) {
        console.warn("⚠️ [WARN] No access token found in cookies or headers for /repos request");
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const response = await axios.get("https://api.github.com/user/repos?per_page=100", {
            headers: { Authorization: `token ${token}` },
        });

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
    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const token = headerToken || cookieToken;
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
    const clearCookieOptions = {
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        clearCookieOptions.sameSite = "None";
        clearCookieOptions.secure = true;
    } else {
        clearCookieOptions.sameSite = "lax";
        clearCookieOptions.secure = false;
    }
    res.clearCookie("accessToken", clearCookieOptions);
    
    console.log(`🍪 Cookie cleared with options:`, clearCookieOptions);
    res.redirect(client);
});

app.listen(port, () => console.log(`🚀 Server running on ${port}`));
