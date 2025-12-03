# Deployment Checklist

## ✅ Backend Status (Render)

**URL:** https://jobportal-oc40.onrender.com

**Status:** ✅ RUNNING (Backend is alive!)

### What to Check:

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Find service: `jobportal-oc40`
   - Check status: Should be "Live"

2. **Verify Environment Variables**
   ```
   ✅ DATABASE_URL
   ✅ JWT_SECRET
   ✅ JWT_REFRESH_SECRET
   ✅ IMAGEKIT_PUBLIC_KEY
   ✅ IMAGEKIT_PRIVATE_KEY
   ✅ IMAGEKIT_URL_ENDPOINT
   ⚠️  FRONTEND_URL (Update after Vercel deployment)
   ✅ NODE_ENV=production
   ```

3. **Check Logs**
   - Go to: Dashboard → Your Service → Logs
   - Look for errors
   - Verify server started successfully

---

## 🌐 Frontend Deployment (Vercel)

### Step-by-Step:

#### 1. Go to Vercel
- URL: https://vercel.com/dashboard
- Click "Add New" → "Project"

#### 2. Import Repository
- Connect GitHub if not connected
- Select your repository
- Click "Import"

#### 3. Configure Project

**Framework Preset:** Next.js ✅

**Root Directory:** `frontend` ⚠️ IMPORTANT!

**Build Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

#### 4. Add Environment Variables

Click "Environment Variables" and add:

```
Name: NEXT_PUBLIC_API_URL
Value: https://jobportal-oc40.onrender.com/api

Name: NEXT_PUBLIC_SOCKET_URL
Value: https://jobportal-oc40.onrender.com
```

#### 5. Deploy
- Click "Deploy"
- Wait 2-5 minutes
- Copy your Vercel URL (e.g., `https://jobportal-xyz.vercel.app`)

---

## 🔄 Update Backend with Frontend URL

After Vercel deployment:

1. **Copy Vercel URL**
   - Example: `https://jobportal-xyz.vercel.app`

2. **Update Render**
   - Go to Render Dashboard
   - Select your service
   - Go to "Environment"
   - Find `FRONTEND_URL`
   - Update value to your Vercel URL
   - Click "Save Changes"

3. **Redeploy Backend**
   - Render will auto-redeploy
   - Wait 2-3 minutes

---

## ✅ Testing Checklist

### 1. Backend Tests

```bash
# Test API
curl https://jobportal-oc40.onrender.com/api/test

# Should return:
# {"message":"Backend is alive!"}
```

✅ **Result:** Backend is working!

### 2. Frontend Tests

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Can navigate to /jobs
- [ ] Can navigate to /auth/login
- [ ] No console errors
- [ ] Images load correctly

### 3. Integration Tests

- [ ] Login works
- [ ] Jobs load from backend
- [ ] Can apply to jobs
- [ ] Can post jobs (as employer)
- [ ] Chat works
- [ ] File uploads work

### 4. Mobile Tests

- [ ] Responsive on mobile
- [ ] All features work on mobile
- [ ] No layout issues

---

## 🐛 If Something Goes Wrong

### Backend Issues

**Check Render Logs:**
```
Dashboard → Your Service → Logs
```

**Common Errors:**
- Database connection failed → Check DATABASE_URL
- Port already in use → Render handles this
- Module not found → Check build command includes `npm install`

### Frontend Issues

**Check Vercel Logs:**
```
Dashboard → Deployments → Latest → View Function Logs
```

**Common Errors:**
- Build failed → Check for TypeScript/ESLint errors
- API calls fail → Check NEXT_PUBLIC_API_URL
- 404 errors → Check root directory is set to `frontend`

### CORS Errors

If you see CORS errors in browser console:

1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slash in URLs
3. Redeploy backend after changing FRONTEND_URL

---

## 📊 Current Status

### Backend (Render)
- ✅ Service is running
- ✅ API endpoint responding
- ⚠️  Need to update FRONTEND_URL after Vercel deployment

### Frontend (Vercel)
- ⏳ Not deployed yet
- ✅ Configuration ready
- ✅ Environment variables prepared

---

## 🎯 Next Steps

1. **Deploy to Vercel** (follow steps above)
2. **Update FRONTEND_URL** on Render
3. **Test everything**
4. **Monitor for 24 hours**

---

## 📞 Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend API:** https://jobportal-oc40.onrender.com/api/test
- **Frontend:** [Your Vercel URL after deployment]

---

**Ready to deploy! Follow the steps above and you'll be live in 10 minutes! 🚀**
