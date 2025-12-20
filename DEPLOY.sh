#!/bin/bash

echo "🚀 Deploying The Pizza Box to GitHub..."

# Deploy Web App
echo "📦 Pushing Customer Website..."
cd /Users/isachinsingh/Desktop/the-pizza-box/apps/web
git remote add origin https://github.com/isachinsingh/the-pizza-box-web.git 2>/dev/null || true
git push -u origin main --force

# Deploy Admin Panel
echo "📦 Pushing Admin Panel..."
cd /Users/isachinsingh/Desktop/the-pizza-box/apps/admin
git remote add origin https://github.com/isachinsingh/the-pizza-box-admin.git 2>/dev/null || true
git push -u origin main --force

echo "✅ Done! Vercel will auto-deploy from GitHub."
echo "🔗 Check your Vercel dashboard: https://vercel.com/dashboard"
