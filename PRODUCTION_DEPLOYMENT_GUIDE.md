# Production Deployment Guide for GitSweep

## 🚨 Current Issue: Authentication Failing in Production

You're getting a 401 "Access token missing" error because the authentication cookies aren't being set/read properly in the production environment.

## 🔧 Required Environment Variables for Production

### Backend (Render.com)
Set these environment variables in your Render dashboard:

```env
# GitHub OAuth (REQUIRED)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Production URLs (REQUIRED)
BACKEND_URL=https://gitsweep.onrender.com
CLIENT=https://your-frontend-url.vercel.app
NODE_ENV=production
PORT=10000
```

### Frontend (Vercel/Netlify)
Set this environment variable in your frontend deployment:

```env
VITE_BACKEND_URL=https://gitsweep.onrender.com
```

## 🔑 GitHub OAuth App Configuration

**CRITICAL**: Update your GitHub OAuth App settings:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update the URLs:
   - **Homepage URL**: `https://your-frontend-url.vercel.app`
   - **Authorization callback URL**: `https://gitsweep.onrender.com/auth/github/callback`

## 🍪 Cookie Issues in Production

The main issue is likely cookie configuration. The fixes I've implemented:

1. **Dynamic cookie settings** based on environment
2. **Proper domain configuration** for Render.com
3. **Secure/SameSite settings** for cross-origin cookies

## 🧪 Testing Steps

1. **Deploy the updated backend** with the environment variables
2. **Update GitHub OAuth app** with production URLs
3. **Test the flow**:
   - Visit your frontend URL
   - Click "Sign in with GitHub"
   - Check browser dev tools for cookie issues

## 🔍 Debugging Production Issues

### Check Browser Dev Tools:
1. **Network tab**: Look for failed requests to `/auth/user`
2. **Application tab**: Check if cookies are being set
3. **Console**: Look for CORS or authentication errors

### Common Issues:
- ❌ GitHub OAuth callback URL mismatch
- ❌ Missing environment variables
- ❌ CORS configuration issues
- ❌ Cookie domain/secure settings

## 🚀 Quick Fix Checklist

- [ ] Set `NODE_ENV=production` in Render
- [ ] Set correct `BACKEND_URL` and `CLIENT` URLs
- [ ] Update GitHub OAuth app callback URL
- [ ] Redeploy backend with new environment variables
- [ ] Test authentication flow

## 📞 If Still Having Issues

If you're still getting 401 errors after these fixes:

1. Check Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the `/auth/user` endpoint directly in browser
4. Check if cookies are being set in the browser dev tools

The authentication should work properly once these production configurations are applied!