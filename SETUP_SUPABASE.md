# 🔧 Fix Your Deployed App - Add Supabase Database

## 🚨 **Current Issue**
Your deployed app is running in "demo mode" with mock data instead of your real Supabase database. This is why it looks different from your local version.

## ✅ **Solution: Add Your Supabase Credentials**

### **Step 1: Get Your Supabase Credentials**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### **Step 2: Add to GitHub Secrets**
1. Go to your GitHub repository: `https://github.com/lennnytobi/tf-game`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add these two secrets:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase Project URL

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon public key

### **Step 3: Trigger Rebuild**
1. Go to **Actions** tab in your repository
2. Click **Deploy to GitHub Pages** workflow
3. Click **Re-run jobs** → **Re-run all jobs**
4. Wait for deployment to complete

### **Step 4: Verify**
Visit your site: `https://lennnytobi.github.io/tf-game`

You should now see:
- ✅ Your real team names (not "Team Alpha", "Team Beta", etc.)
- ✅ Your actual quiz questions
- ✅ Real scoreboard data
- ✅ Admin functionality working with your database

## 🔍 **How to Check if It's Working**
- **Before**: Teams show as "Team Alpha", "Team Beta", etc.
- **After**: Teams show your real names from Supabase
- **Quiz**: Questions will be your actual questions, not mock ones
- **Admin**: Will connect to your real database

## 🆘 **Need Help?**
If you can't find your Supabase credentials, let me know and I'll help you locate them!
