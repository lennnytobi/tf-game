# Deployment Guide

## Deploy to Vercel

### Prerequisites
1. Create a Vercel account at https://vercel.com/signup
2. Have your Supabase credentials ready

### Quick Deploy

#### Option 1: Via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   
   - `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
   - `SUPABASE_SERVICE_KEY` → Your Supabase service role key
   - `ADMIN_CODE` → Your admin access password

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for first deployment
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts and add environment variables when asked.

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Post-Deployment

#### Test Your Deployment
- ✅ Visit your Vercel URL
- ✅ Test leaderboard display
- ✅ Test quiz functionality
- ✅ Test admin panel at `/admin`
- ✅ Verify real-time updates

#### Configure Supabase (Recommended)
1. Go to your Supabase dashboard
2. Settings → API → URL Configuration
3. Add your Vercel domain to allowed origins

### Continuous Deployment
- Push to `main` branch → Auto-deploys to production
- Push to other branches → Creates preview deployments
- Pull requests → Automatic preview URLs

### Custom Domain (Optional)
1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Free SSL certificate included

### Troubleshooting

**Build Fails:**
- Check Vercel build logs
- Verify all environment variables are set
- Ensure `npm run build` works locally

**Database Connection Issues:**
- Verify Supabase environment variables are correct
- Check Supabase project is not paused
- Verify RLS policies allow public access where needed

**Admin Panel Not Working:**
- Verify `ADMIN_CODE` is set in Vercel
- Check `SUPABASE_SERVICE_KEY` is correct
- Review API route logs in Vercel dashboard

### Environment Variables Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | Service role key (secret!) | Supabase Dashboard → Settings → API |
| `ADMIN_CODE` | Admin password | Choose a secure password |

### Support
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

