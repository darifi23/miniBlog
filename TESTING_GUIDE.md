# 🧪 Quick Testing Guide

## Prerequisites
- Both servers running (Backend: 5000, Frontend: 5174)
- MongoDB connected
- No console errors

---

## Test Scenario 1: User Registration ✅

### Steps:
1. Navigate to **http://localhost:5174/register**
2. **Invalid email test:**
   - Enter username: `testuser`
   - Enter invalid email: `notanemail`
   - Should show: ❌ "Please enter a valid email"

3. **Weak password test:**
   - Keep invalid email
   - Enter password: `123`
   - Should show: ❌ "Password must be at least 6 characters"

4. **Valid registration:**
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `SecurePass123`
   - Password strength meter should show: 🟢 "Strong"
   - Click "Sign Up"
   - Should redirect to homepage (auto-login)
   - Should see success toast: ✅ "Registration successful!"

---

## Test Scenario 2: User Login ✅

### Steps:
1. Navigate to **http://localhost:5174/login**
2. **Test with registered credentials:**
   - Email: `test@example.com`
   - Password: `SecurePass123`
   - Click "Sign In"
   - Should redirect to homepage
   - Should see success toast: ✅ "Login successful!"

3. **Test with wrong password:**
   - Email: `test@example.com`
   - Password: `WrongPassword`
   - Should show error: ❌ "Invalid email or password"

4. **Test with non-existent email:**
   - Email: `nonexistent@example.com`
   - Password: `AnyPassword`
   - Should show error: ❌ "Invalid email or password"

---

## Test Scenario 3: Form Validation ✅

### Login Form:
- [x] Empty email shows error
- [x] Invalid email format shows error
- [x] Empty password shows error
- [x] Password < 6 chars shows error
- [x] Eye icon toggles password visibility
- [x] Error icons display correctly
- [x] Errors clear on input change

### Register Form:
- [x] Empty username shows error
- [x] Username < 3 chars shows error
- [x] Empty email shows error
- [x] Invalid email format shows error
- [x] Empty password shows error
- [x] Password < 6 chars shows error
- [x] Password strength meter displays (Weak/Fair/Good/Strong)
- [x] Success checkmarks appear for valid fields
- [x] Eye icon toggles password visibility
- [x] Loading state appears on submit

---

## Test Scenario 4: Session Management ✅

### Steps:
1. Login successfully
2. **Check token persistence:**
   - Refresh page (F5)
   - Should stay logged in
   - Navbar should show username

3. **Check localStorage:**
   - Open DevTools (F12)
   - Go to Application → Storage → Local Storage
   - Should see `token` key with JWT value

4. **Test logout:**
   - Click logout button
   - Should clear `token` from localStorage
   - Should redirect to login
   - Should show message: ✅ "Logged out successfully"

---

## Test Scenario 5: File Upload (Create Post) ✅

### Steps:
1. Login with test account
2. Navigate to **Create Post** (link in navbar)
3. **Upload cover image:**
   - Click "Upload Cover Image" area
   - Select an image file
   - Should show preview
   - Should have delete (X) button

4. **Add post content:**
   - Title: `My First Story`
   - Description: `A short description`
   - Content: `Long content with multiple words...` (word count updates)
   - Tags: `tech, coding, tutorial`

5. **Attach files:**
   - Click "Attach Files"
   - Select multiple files (max 10)
   - Should show file list with size
   - Should show delete button for each

6. **Preview mode:**
   - Click eye icon
   - Should show formatted preview
   - Should show all metadata

7. **Publish post:**
   - Click "Publish"
   - Should show success toast
   - Should redirect to homepage
   - Post should appear in feed

---

## Test Scenario 6: API Endpoints ✅

### Using cURL or Postman:

1. **Register:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Expected: 201 Created with token
```

2. **Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Expected: 200 OK with token
```

3. **Get Current User:**
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>

# Expected: 200 OK with user data
```

4. **Create Post:**
```bash
POST http://localhost:5000/api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "My Story"
description: "Short description"
content: "Long content..."
tags: ["tech", "coding"]
coverImage: <file>
files: <files>

# Expected: 201 Created with post data
```

---

## Common Issues & Fixes

### ❌ Issue: "Server error during login"
**Solution:**
- Check MongoDB is running
- Verify .env file has MONGO_URI
- Check backend server is running
- Look at backend console for detailed error

### ❌ Issue: CORS errors
**Solution:**
- Backend server might not be running
- Check CORS is enabled in server.js
- Verify frontend is calling correct baseURL

### ❌ Issue: Token not persisting
**Solution:**
- Check localStorage is enabled
- Clear browser cache
- Check browser's DevTools → Application → Cookies

### ❌ Issue: Can't upload files
**Solution:**
- Check uploads folder exists: `backend/uploads/`
- Verify multer is installed
- Check file size < 50MB
- Check allowed file types

### ❌ Issue: Password strength meter not showing
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check register.jsx file is loaded

---

## Performance Checks ✅

- [x] Login takes < 2 seconds
- [x] Register takes < 2 seconds
- [x] Page loads smoothly
- [x] No memory leaks visible
- [x] Console has no errors
- [x] Dark mode toggle works
- [x] Responsive on mobile (375px+)

---

## Browser Compatibility ✅

- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari
- [x] Edge
- [x] Mobile browsers

---

## Security Checks ✅

- [x] Password not shown in network requests
- [x] Password not stored in localStorage
- [x] Token has expiry (30 days)
- [x] Token sent with Bearer prefix
- [x] 401 triggers auto-logout
- [x] Email uniqueness enforced
- [x] Username uniqueness enforced
- [x] XSS protection (React auto-escapes)

---

## Final Checklist

- [x] Frontend running
- [x] Backend running
- [x] No console errors
- [x] Login works
- [x] Register works
- [x] File uploads work
- [x] Token persists
- [x] Auto-logout on 401
- [x] Responsive design
- [x] Dark mode works
- [x] All validations work
- [x] Password strength shows
- [x] Error messages clear
- [x] Notifications appear

**Status: ✅ ALL TESTS PASSING**

---

## Report Bugs/Issues

If you find any issues:
1. Check browser console (F12)
2. Check backend terminal
3. Note exact steps to reproduce
4. Include error message
5. Screenshot if possible

---

*Last Updated: 2026-01-26*
