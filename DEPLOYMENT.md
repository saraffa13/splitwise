# Deployment Guide

This guide will help you deploy the Splitwise application to Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub repository: https://github.com/saraffa13/splitwise.git
- MongoDB Atlas account (or your MongoDB connection string)
- Vercel account
- Render account

## Backend Deployment (Render)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `saraffa13/splitwise`
   - Configure the service:
     - **Name**: `splitwise-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm run server`
     - **Root Directory**: Leave empty (root of repo)

3. **Environment Variables**:
   Add these in Render dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave empty, Render will assign)
   - `MONGODB_URI` = Your MongoDB Atlas connection string
     (e.g., `mongodb+srv://username:password@cluster.mongodb.net/splitwise`)

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the URL (e.g., `https://splitwise-backend.onrender.com`)

## Frontend Deployment (Vercel)

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import from GitHub: `saraffa13/splitwise`
   - Configure the project:
     - **Framework Preset**: Leave as default or select "Other"
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Environment Variables**:
   Add this in Vercel dashboard:
   - `REACT_APP_API_URL` = Your Render backend URL + `/api`
     (e.g., `https://splitwise-backend.onrender.com/api`)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your app will be live!

## Alternative: Using render.yaml

If you prefer using the `render.yaml` file:

1. In Render dashboard, when creating the service, select "Apply render.yaml"
2. The configuration will be automatically read from the `render.yaml` file
3. You'll still need to add the `MONGODB_URI` environment variable manually

## Post-Deployment

1. **Update CORS** (if needed):
   - In `server/index.js`, make sure CORS allows your Vercel domain
   - Or use `app.use(cors())` to allow all origins (for development)

2. **Test the deployment**:
   - Visit your Vercel URL
   - Create a project and test all features
   - Check that API calls are working

## Troubleshooting

- **CORS Errors**: Make sure your backend CORS settings allow your frontend domain
- **API Connection**: Verify `REACT_APP_API_URL` is set correctly in Vercel
- **MongoDB Connection**: Ensure your MongoDB Atlas IP whitelist includes Render's IPs (or use `0.0.0.0/0` for all IPs)
- **Build Errors**: Check the build logs in Vercel/Render dashboards

## Environment Variables Summary

### Backend (Render):
- `NODE_ENV` = `production`
- `PORT` = `10000` (optional)
- `MONGODB_URI` = Your MongoDB connection string

### Frontend (Vercel):
- `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`

