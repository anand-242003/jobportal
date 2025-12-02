# Deployment Guide - Vercel + Render

## ✅ Changes Made

### Frontend Changes
1. ✅ Updated `axiosInstance.js` to use environment variables
2. ✅ Updated `socketClient.js` to use environment variables
3. ✅ Created `.env.local` for local development
4. ✅ Created `.env.production` for production build

### Backend Changes
1. ✅ Updated CORS in `app.js` to accept multiple origins
2. ✅ Updated Socket.io CORS in `server.js` to accept multiple origins
3. ✅ Both now use `FRONTEND_URL` environment variable

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Add Environment Variable in Render Dashboard:**
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   Replace `your-vercel-app.vercel.app` with your actual Vercel URL

2. **Existing Environment Variables (keep these):**
   ```
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5001
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint
   ```

3. **Redeploy Backend** (Render will auto-deploy on git push)

---

### Step 2: Deploy Frontend to Vercel

1. **Add Environment Variables in Vercel Dashboard:**
   
   Go to: Project Settings → Environment Variables
   
   Add these variables for **Production**:
   ```
   NEXT_PUBLIC_API_URL=https://jobportal-oc40.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://jobportal-oc40.onrender.com
   ```

2. **Redeploy Frontend:**
   - Push to git (Vercel auto-deploys)
   - Or manually redeploy from Vercel dashboard

---

## 📝 Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5001
FRONTEND_URL=https://your-vercel-app.vercel.app
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://jobportal-oc40.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://jobportal-oc40.onrender.com
```

### Local Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

## 🔍 Troubleshooting

### Issue: "Route not found" errors
**Cause:** Frontend calling backend root `/` instead of `/api/*`
**Solution:** Ensure `NEXT_PUBLIC_API_URL` is set in Vercel

### Issue: CORS errors
**Cause:** Backend not allowing your Vercel domain
**Solution:** Set `FRONTEND_URL` in Render environment variables

### Issue: Socket.io not connecting
**Cause:** Socket URL not configured
**Solution:** Ensure `NEXT_PUBLIC_SOCKET_URL` is set in Vercel

### Issue: Cookies not working
**Cause:** Cross-origin cookie restrictions
**Solution:** 
- Ensure `withCredentials: true` in axios (✅ already set)
- Ensure `credentials: true` in CORS (✅ already set)
- For production, consider using same domain or subdomain

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health check: `https://jobportal-oc40.onrender.com/api/test`
- [ ] Frontend loads: `https://your-vercel-app.vercel.app`
- [ ] API calls work (check browser Network tab)
- [ ] Socket.io connects (check browser Console)
- [ ] Login/Signup works
- [ ] Chat functionality works
- [ ] No CORS errors in console

---

## 🔗 Quick Links

### Vercel Dashboard
- Environment Variables: Project Settings → Environment Variables
- Deployments: Deployments tab
- Logs: Deployment → View Function Logs

### Render Dashboard
- Environment Variables: Dashboard → Environment
- Logs: Dashboard → Logs
- Manual Deploy: Dashboard → Manual Deploy

---

## 📌 Important Notes

1. **Environment Variables:** Changes require redeployment
2. **CORS:** Both frontend and backend must allow each other
3. **Socket.io:** Uses same backend URL without `/api` path
4. **Cookies:** May have issues with cross-origin in production
5. **HTTPS:** Vercel provides HTTPS automatically, Render too

---

## 🎯 Next Steps After Deployment

1. Test all features thoroughly
2. Monitor logs for errors
3. Set up error tracking (Sentry, LogRocket, etc.)
4. Configure custom domain (optional)
5. Set up CI/CD pipeline (optional)
6. Enable caching and optimization

---

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Check Render logs for backend errors
3. Check Vercel function logs
4. Verify all environment variables are set
5. Ensure backend is running (not sleeping)
6. Test API endpoints directly with Postman/curl

---

## 📞 Support

If issues persist:
1. Check backend logs in Render
2. Check frontend logs in Vercel
3. Verify environment variables are correct
4. Ensure backend URL is accessible
5. Test with curl/Postman first
