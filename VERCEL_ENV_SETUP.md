# Vercel Environment Variables Setup

## 🎯 Quick Setup Guide

### Step 1: Go to Vercel Dashboard
1. Open your project in Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in sidebar

### Step 2: Add These Variables

**For Production Environment:**

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_API_URL` | `https://jobportal-oc40.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://jobportal-oc40.onrender.com` |

### Step 3: Select Environment
- ✅ Check **Production**
- ✅ Check **Preview** (optional)
- ⬜ Leave **Development** unchecked (uses .env.local)

### Step 4: Save and Redeploy
1. Click **Save** for each variable
2. Go to **Deployments** tab
3. Click **⋯** on latest deployment
4. Click **Redeploy**

---

## 🔧 Render Environment Variables

### Go to Render Dashboard
1. Open your backend service
2. Click **Environment** tab
3. Add this variable:

| Variable Name | Value |
|--------------|-------|
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` |

Replace `your-vercel-app.vercel.app` with your actual Vercel URL

---

## ✅ Verification

After setup, test these URLs:

1. **Backend Health:**
   ```
   https://jobportal-oc40.onrender.com/api/test
   ```
   Should return: `{"message": "Backend is alive!"}`

2. **Frontend:**
   ```
   https://your-vercel-app.vercel.app
   ```
   Should load without errors

3. **Check Browser Console:**
   - No CORS errors
   - Socket.io connects successfully
   - API calls work

---

## 🚨 Common Mistakes

❌ **Wrong:** `NEXT_PUBLIC_API_URL=https://jobportal-oc40.onrender.com`
✅ **Correct:** `NEXT_PUBLIC_API_URL=https://jobportal-oc40.onrender.com/api`

❌ **Wrong:** `NEXT_PUBLIC_SOCKET_URL=https://jobportal-oc40.onrender.com/api`
✅ **Correct:** `NEXT_PUBLIC_SOCKET_URL=https://jobportal-oc40.onrender.com`

❌ **Wrong:** Forgetting to redeploy after adding variables
✅ **Correct:** Always redeploy after environment variable changes

---

## 📱 Screenshot Guide

### Vercel Environment Variables Page Should Look Like:

```
Environment Variables

Name: NEXT_PUBLIC_API_URL
Value: https://jobportal-oc40.onrender.com/api
Environments: ✅ Production ✅ Preview

Name: NEXT_PUBLIC_SOCKET_URL  
Value: https://jobportal-oc40.onrender.com
Environments: ✅ Production ✅ Preview
```

---

## 🎉 That's It!

Your frontend will now correctly communicate with your backend on Render.
