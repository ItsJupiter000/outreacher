# 🚀 Vercel Deployment Fix Guide

## The Problem

Vercel is a **frontend hosting platform** optimized for Next.js, React, and static sites. It **cannot run traditional Node.js/Express backends** like your `server/index.js`.

Your app has two parts:
- **Frontend** (Next.js) → Can deploy to Vercel ✅
- **Backend** (Express) → Needs separate hosting ❌

## Solution: Split Deployment

### Frontend → Vercel
### Backend → Railway/Render/Heroku

---

## Step 1: Deploy Frontend to Vercel

### Update Vercel Project Settings

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Set **Root Directory**: `client`
4. Set **Framework Preset**: Next.js
5. **Build Command**: `npm run build` (default)
6. **Output Directory**: `.next` (default)
7. **Install Command**: `npm install` (default)

### Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.railway.app
   ```
   (You'll get this URL after deploying backend)

3. Click **Save**
4. Redeploy

---

## Step 2: Deploy Backend to Railway (Recommended)

### Why Railway?
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Supports Node.js/Express
- ✅ Auto-deploy from GitHub
- ✅ Environment variables support

### Deployment Steps

1. **Sign up at Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your `job-outreach-bot` repository

3. **Configure Service**
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`
   - Railway auto-detects Node.js

4. **Add Environment Variables**
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   HUNTER_API_KEY=your-hunter-api-key
   PORT=5000
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

6. **Update Vercel**
   - Go back to Vercel
   - Update `NEXT_PUBLIC_API_URL` with Railway URL
   - Redeploy frontend

---

## Alternative: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your repository
5. Configure:
   - **Name**: job-outreach-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment**: Node
6. Add environment variables
7. Click **"Create Web Service"**

---

## Alternative: Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd d:\emailer\server
heroku create your-app-name

# Set environment variables
heroku config:set GMAIL_USER=your-email@gmail.com
heroku config:set GMAIL_APP_PASSWORD=your-app-password
heroku config:set HUNTER_API_KEY=your-api-key

# Create Procfile
echo "web: node index.js" > Procfile

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a your-app-name
git push heroku main
```

---

## Step 3: Update Frontend API Calls

I've created `client/lib/api-config.ts` to handle dynamic API URLs.

The frontend will automatically use:
- **Development**: `http://localhost:5000`
- **Production**: Value from `NEXT_PUBLIC_API_URL` environment variable

---

## Step 4: Test Your Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app/api/dashboard
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try searching for a company
   - Check if API calls work

---

## Current Vercel Configuration

Your `vercel.json` is now configured to:
- Build only the frontend (`client` directory)
- Use Next.js framework
- Run `npm run build` for production

---

## Quick Setup Summary

```bash
# 1. Deploy Backend to Railway
# - Sign up at railway.app
# - Connect GitHub repo
# - Set root directory: server
# - Add environment variables
# - Deploy

# 2. Update Vercel Environment Variable
# - Add NEXT_PUBLIC_API_URL with Railway URL
# - Redeploy

# 3. Push changes to GitHub
git add .
git commit -m "Configure for split deployment"
git push origin main
```

---

## Why This Approach?

| Platform | Purpose | Cost |
|----------|---------|------|
| **Vercel** | Frontend hosting | Free tier |
| **Railway** | Backend API | Free tier ($5 credit/month) |

**Benefits:**
- ✅ Both have free tiers
- ✅ Auto-deploy from GitHub
- ✅ Easy environment variable management
- ✅ HTTPS included
- ✅ Good performance

---

## Need Help?

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## Next Steps

1. Choose a backend hosting platform (Railway recommended)
2. Deploy backend following steps above
3. Copy backend URL
4. Add `NEXT_PUBLIC_API_URL` to Vercel
5. Redeploy frontend
6. Test the application

Your app will then be fully deployed with automatic CI/CD! 🎉
