# Deployment Guide - Job Outreach Bot

## GitHub Setup

### 1. Initialize Git Repository

```bash
cd d:\emailer
git init
git add .
git commit -m "Initial commit: Job Outreach Bot with navbar, sidebar, pagination, and filters"
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com/new)
2. Create a new repository named `job-outreach-bot`
3. **Do NOT** initialize with README (we already have one)
4. Click "Create repository"

### 3. Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-outreach-bot.git
git push -u origin main
```

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your `job-outreach-bot` repository
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `GMAIL_USER` | your-email@gmail.com | Production, Preview, Development |
   | `GMAIL_APP_PASSWORD` | your-app-password | Production, Preview, Development |
   | `HUNTER_API_KEY` | your-hunter-api-key | Production, Preview, Development |
   | `PORT` | 5000 | Production, Preview, Development |

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd d:\emailer
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? job-outreach-bot
# - Directory? ./client
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## Automatic CI/CD Setup

Once connected to Vercel, CI/CD is **automatically configured**:

### What Happens Automatically

1. **Push to `main` branch**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
   → Triggers automatic production deployment

2. **Create Pull Request**
   ```bash
   git checkout -b feature/new-feature
   git push origin feature/new-feature
   ```
   → Creates preview deployment with unique URL

3. **Merge PR**
   → Automatically deploys to production

### Deployment Pipeline

```
Push to main
    ↓
GitHub webhook triggers Vercel
    ↓
Vercel clones repository
    ↓
Installs dependencies (npm install)
    ↓
Runs build (npm run build)
    ↓
Deploys to CDN
    ↓
Live in production! 🎉
```

### Build Logs

- View real-time build logs in Vercel dashboard
- Get email notifications on deployment status
- Automatic rollback on build failures

---

## Environment Variables Management

### Adding New Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add variable and select environments
5. Redeploy for changes to take effect

### Updating Variables

1. Edit in Vercel dashboard
2. Trigger redeploy:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Vercel automatically provisions SSL certificate

---

## Monitoring & Logs

### View Deployment Logs
- Vercel Dashboard → Deployments → Click on deployment
- View build logs, runtime logs, and errors

### Analytics
- Vercel Dashboard → Analytics
- View page views, performance metrics

### Error Tracking
- Automatic error detection
- Email notifications for build failures

---

## Troubleshooting

### Build Fails

**Check:**
1. Environment variables are set correctly
2. All dependencies are in `package.json`
3. Build command is correct
4. Node version compatibility

**View logs:**
- Vercel Dashboard → Deployments → Failed deployment → Logs

### Environment Variables Not Working

**Solution:**
1. Ensure variables are added for correct environment
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Backend API Not Working

**Note:** Vercel is optimized for frontend. For backend:

**Option 1:** Deploy backend separately (Railway, Render, Heroku)
**Option 2:** Use Vercel Serverless Functions (requires refactoring)

---

## Best Practices

1. **Branch Protection**
   - Enable branch protection on `main`
   - Require PR reviews before merging

2. **Preview Deployments**
   - Test features in preview before merging
   - Share preview URLs with team

3. **Environment Separation**
   - Use different API keys for production/preview
   - Test thoroughly in preview environment

4. **Commit Messages**
   - Use clear, descriptive commit messages
   - Follow conventional commits format

---

## Quick Commands Reference

```bash
# Push changes and auto-deploy
git add .
git commit -m "Your message"
git push origin main

# Create feature branch
git checkout -b feature/name
git push origin feature/name

# View deployment status
vercel ls

# View logs
vercel logs

# Rollback to previous deployment
vercel rollback
```

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Issues**: Open an issue on GitHub repository

---

**Congratulations!** 🎉 Your app is now deployed with automatic CI/CD!
