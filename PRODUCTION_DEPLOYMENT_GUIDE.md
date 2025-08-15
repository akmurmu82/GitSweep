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
CLIENT=https://your-actual-frontend-url.vercel.app
NODE_ENV=production
PORT=10000
```

### Frontend (Vercel/Netlify)
Set this environment variable in your frontend deployment:

```env
VITE_BACKEND_URL=https://your-actual-backend-url.onrender.com
```

## 🔑 GitHub OAuth App Configuration

**CRITICAL**: Update your GitHub OAuth App settings:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update the URLs:
   - **Homepage URL**: `https://your-actual-frontend-url.vercel.app`
   - **Authorization callback URL**: `https://your-actual-backend-url.onrender.com/auth/github/callback`

## 🍪 Cookie Issues in Production

The main issues with cookies in production and their fixes:

### 1. **SameSite=None for Cross-Origin Cookies**
- Production requires `SameSite=None` for cross-origin requests
- Must be paired with `Secure=true` (HTTPS only)

### 2. **CORS Configuration**
- Must allow credentials: `credentials: true`
- Must specify exact origins (no wildcards with credentials)
- Must include `Cookie` in allowed headers

### 3. **Domain Configuration**
- Don't set explicit domain for Render.com (let it default)
- Avoid subdomain issues by not setting domain attribute

### 4. **HTTPS Requirement**
- `Secure=true` cookies only work over HTTPS
- Both frontend and backend must use HTTPS in production

## 🧪 Testing Steps

1. **Deploy the updated backend** with the environment variables
2. **Update GitHub OAuth app** with production URLs
3. **Update CORS origins** in the backend code with your actual URLs
4. **Test the flow**:
   - Visit your frontend URL
   - Click "Sign in with GitHub"
   - Check browser dev tools for cookie issues
   - Look for CORS errors in console
   - Verify cookies are being sent in Network tab

## 🔍 Debugging Production Issues

### Check Browser Dev Tools:
1. **Network tab**: Look for failed requests to `/auth/user`
   - Check if cookies are being sent in request headers
   - Look for CORS preflight OPTIONS requests
2. **Application tab**: Check if cookies are being set
   - Verify `SameSite` and `Secure` attributes
   - Check cookie domain and path
3. **Console**: Look for CORS or authentication errors
   - CORS errors will show specific blocked origins
   - Authentication errors will show 401 responses

### Common Issues:
- ❌ GitHub OAuth callback URL mismatch
- ❌ Missing environment variables
- ❌ CORS origin not matching exactly
- ❌ Cookie `SameSite=None` without `Secure=true`
- ❌ Mixed HTTP/HTTPS causing cookie issues
- ❌ Frontend not sending `withCredentials: true`

## 🚀 Quick Fix Checklist

- [ ] Set `NODE_ENV=production` in Render
- [ ] Set correct `BACKEND_URL` and `CLIENT` URLs
- [ ] Update CORS origins in backend code with actual URLs
- [ ] Update GitHub OAuth app callback URL
- [ ] Ensure both frontend and backend use HTTPS
- [ ] Verify cookie attributes: `SameSite=None; Secure=true`
- [ ] Redeploy backend with new environment variables
- [ ] Test authentication flow
- [ ] Check browser dev tools for cookie and CORS issues

## 📞 If Still Having Issues

If you're still getting 401 errors after these fixes:

1. Check Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the `/auth/user` endpoint directly in browser
4. Check if cookies are being set in the browser dev tools

The authentication should work properly once these production configurations are applied!