# 🚀 Vercel Deployment Instructions

Your app is ready to deploy! Follow these steps to get it live on Vercel.

## ✅ Prerequisites Complete

- ✅ Build configuration updated (removed Turbopack from production build)
- ✅ `.vercelignore` file created
- ✅ Environment variables documented in `env.production.example`
- ✅ Code committed and pushed to GitHub: https://github.com/lennnytobi/tf-game

## 📋 Next Steps

### Step 1: Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"** (recommended)
3. Authorize Vercel to access your GitHub account
4. Verify your email if prompted

### Step 2: Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"tf-game"** and click **"Import"**
4. Vercel will auto-detect it's a Next.js app ✨

### Step 3: Configure Environment Variables

**IMPORTANT:** Before deploying, add these 4 environment variables:

Click **"Environment Variables"** and add:

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Supabase Dashboard → Settings → API → Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_KEY` | Your service role key | Supabase Dashboard → Settings → API → Project API keys → `service_role` (⚠️ Keep secret!) |
| `ADMIN_CODE` | Your admin password | Choose a secure password (e.g., `Admin123!`) |

**Copy these from your current `.env.local` file!**

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. You'll see "🎉 Congratulations!" when done
4. Click **"Visit"** to see your live app!

### Step 5: Test Your Deployment

Visit your Vercel URL (e.g., `https://tf-game.vercel.app`) and test:

- ✅ **Leaderboard** - Should display teams with 0% stress level
- ✅ **Quiz Tab** - Select a team and answer questions
- ✅ **Admin Panel** - Go to `/admin`, enter your `ADMIN_CODE`
- ✅ **Real-time Updates** - Open two browser tabs, award points in admin, see leaderboard update

### Step 6: Configure Supabase (Optional but Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings** → **API** → **URL Configuration**
3. Add your Vercel domain to **Allowed Origins**:
   - `https://tf-game.vercel.app`
   - `https://tf-game-*.vercel.app` (for preview deployments)

## 🎯 Your Deployment URLs

After deployment, you'll have:

- **Production:** `https://tf-game.vercel.app`
- **Admin Panel:** `https://tf-game.vercel.app/admin`

## 🔄 Automatic Deployments

From now on:

- **Push to `main` branch** → Automatically deploys to production
- **Push to other branches** → Creates preview deployments
- **Pull requests** → Automatic preview URLs for testing

## 🌐 Custom Domain (Optional)

Want a custom domain like `game.yourdomain.com`?

1. In Vercel dashboard: **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Free SSL certificate included!

## ❓ Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all 4 environment variables are set
- Test `npm run build` locally

### Database Not Working
- Double-check Supabase environment variables
- Ensure Supabase project is active (not paused)
- Verify RLS policies in Supabase

### Admin Panel Issues
- Verify `ADMIN_CODE` is set correctly
- Check `SUPABASE_SERVICE_KEY` is the service role key (not anon key)
- Review function logs in Vercel dashboard

## 📚 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs

## 🎉 Success Checklist

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] All 4 environment variables added
- [ ] Deployment successful
- [ ] Leaderboard works
- [ ] Quiz works
- [ ] Admin panel accessible
- [ ] Real-time updates working

---

**Need help?** Check the detailed guide in `DEPLOYMENT.md`

**Your GitHub Repo:** https://github.com/lennnytobi/tf-game

