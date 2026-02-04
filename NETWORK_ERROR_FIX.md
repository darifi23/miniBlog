# Network Error Troubleshooting & Fix Guide

## Problem
The register/login pages show a "Network Error" toast message when submitting the form, preventing users from creating accounts or logging in.

## Root Causes Identified

### 1. **Missing Toaster Component** ✅ FIXED
- **Issue:** React-hot-toast's `Toaster` component was not rendered in the App component
- **Impact:** Toast notifications would call but not display properly
- **Fix Applied:** Added `import { Toaster } from 'react-hot-toast'` and placed `<Toaster position="top-right" reverseOrder={false} />` in App.jsx

### 2. **CORS Configuration**  ✅ IMPROVED
- **Issue:** CORS middleware was too generic (`app.use(cors())`)
- **Fix Applied:** Updated backend/server.js with explicit CORS configuration:
  ```javascript
  const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  ```

### 3. **Error Logging** ✅ IMPROVED
- **Issue:** Network errors weren't being logged for debugging
- **Fix Applied:** Added `console.error()` calls in AuthContext for both login and register failures

### 4. **Database Case Sensitivity** ✅ FIXED (Previously)
- **Issue:** MongoDB URI in .env had mixed case 'MiniBlog' but DB exists as 'miniblog'
- **Fix Applied:** Changed `.env MONGO_URI=mongodb://localhost:27017/miniblog` (lowercase)

### 5. **CSS Tailwind Error** ✅ FIXED (Previously)
- **Issue:** Missing color `charcoal-600` in Tailwind config
- **Fix Applied:** Changed `dark:hover:bg-charcoal-600` → `dark:hover:bg-charcoal-700` in frontend/src/index.css

## Testing Results

### Backend Auth Endpoints: ✅ **WORKING**
- Register: 201 Created (returns JWT token)
- Login: 200 OK (returns JWT token)  
- GetMe: 200 OK (auth middleware working)

### Frontend Puppeteer Tests: ✅ **WORKING**
- Register form submission: **Success**
- Login form submission: **Success**
- No console errors captured

## Files Modified

1. **frontend/src/App.jsx** - Added Toaster component
2. **frontend/src/context/AuthContext.jsx** - Added error logging
3. **backend/server.js** - Improved CORS configuration
4. **backend/.env** - Fixed MongoDB database name (done previously)
5. **frontend/src/index.css** - Fixed Tailwind color (done previously)

## How to Use

### Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Test Registration
1. Navigate to http://localhost:5173/register
2. Fill in form:
   - Username: testuser
   - Email: test@example.com
   - Password: Password123!
3. Click "Sign Up"
4. Should see success toast (previously showed "Network Error")

### Verify Fix
- Check browser DevTools Console for any errors
- All error messages should now display clearly in toast notifications
- Backend console should show successful requests

## Next Steps if Still Getting Network Error

1. **Check Backend is Running:**
   ```bash
   curl http://localhost:5000/api/posts
   ```

2. **Check Frontend is Running:**
   ```bash
   curl http://localhost:5173/
   ```

3. **Check Network Tab in DevTools:**
   - Look at failed requests to `/api/auth/register` or `/api/auth/login`
   - Check response status and error message
   - Verify CORS headers are present

4. **Check Console for Specific Error:**
   - With logging added, should see detailed error in browser console
   - Copy and share that error for more specific debugging

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Network Error" still showing | Verify backend is running on port 5000 |
| CORS error in console | Ensure frontend is running on 5173 |
| 401 Unauthorized | JWT token not being sent, check Authorization header |
| 400 Bad Request | Form validation failed, check input values |
| Port already in use | Kill the process using the port and restart |

---

Created: 2026-01-29
Last Updated: 2026-01-29
