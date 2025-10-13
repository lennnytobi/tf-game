# GitHub Pages Deployment Guide

## ⚠️ Important Limitations

This Next.js app has been configured for static export to GitHub Pages, but there are some limitations:

### 🚫 What Won't Work:
- **Server-side API routes** - All API routes are disabled for static export
- **Server-side rendering** - All pages are pre-rendered at build time

### ✅ What Will Work:
- **Quiz functionality** - All client-side quiz features work perfectly
- **Admin functionality** - Admin page works with client-side Supabase integration
- **Supabase integration** - Database reads/writes work from client-side
- **Real-time leaderboard** - Supabase Realtime updates work
- **Team members display** - Static content works fine
- **Points awarding** - Admin can award points directly through Supabase

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

### 2. Set up GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to main

### 3. Set up Environment Variables
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### 4. Admin Functionality
The admin page now works with client-side Supabase integration:

**Admin Code**: `admin123` (hardcoded for simplicity)
**Features**:
- Award points for games
- View ledger history
- Undo entries
- Team selection with member names
- Game selection dropdown

**Security Note**: The admin code is client-side only. For production, consider:
- Using Supabase Auth for better security
- Implementing RLS policies with user roles
- Using environment variables for admin codes

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run export
```

## 📁 Build Output

The static files will be generated in the `out/` directory and automatically deployed to GitHub Pages.

## 🌐 Your Site URL

Once deployed, your site will be available at:
`https://[your-username].github.io/[repository-name]`
