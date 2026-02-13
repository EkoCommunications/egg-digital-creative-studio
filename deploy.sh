#!/bin/bash
echo "=== Egg Digital Creative Studio - Vercel Deployment ==="
echo ""
echo "Step 1: Login to Vercel"
npx vercel login
echo ""
echo "Step 2: Deploy to production"
npx vercel --yes --prod
echo ""
echo "=== Deployment complete! ==="
