# MiniBlog - Fixes & Enhancements Documentation

## 🔧 Fixed Issues

### 1. **Auth Middleware Error Handling** ✅
**File:** `backend/middlewares/authMiddleware.js`

**Issue:** The middleware was sending multiple responses in some cases, causing "headers already sent" errors.

**Fix:** Added `return` statements to ensure the function exits after sending a response.

```javascript
// Before: would continue execution after sending response
// After: added return statements
return res.status(401).json({ message: 'Not authorized, token failed' });
return res.status(401).json({ message: 'Not authorized, no token' });
```

### 2. **Login/Register User ID Inconsistency** ✅
**Files:** 
- `backend/controllers/authController.js` (registerUser & loginUser)

**Issue:** Login/Register were using `user.id` instead of `user._id`, causing inconsistent ID handling with MongoDB.

**Fix:** Standardized to use `user._id` for all user references.

```javascript
// Before
_id: user.id,

// After
_id: user._id,
```

### 3. **Missing Input Validation** ✅
**File:** `backend/controllers/authController.js` (loginUser)

**Issue:** Login didn't validate if email/password were provided.

**Fix:** Added validation check at the start of loginUser function.

```javascript
if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
}
```

---

## 🚀 New Features: Medium-Style Blog Platform

### Enhanced Post Model
**File:** `backend/models/Post.js`

New fields added to support Medium-like features:

```javascript
{
    title: String,
    content: String,
    description: String,              // ✨ NEW: Brief description/excerpt
    author: ObjectId,
    coverImage: String,               // ✨ NEW: Cover image URL
    tags: [String],                   // ✨ NEW: Topic tags
    files: [{                         // ✨ NEW: Attached files
        filename: String,
        url: String,
        fileType: String,
        size: Number,
        uploadedAt: Date
    }],
    likes: [ObjectId],
    comments: [{ user, text, createdAt }],
    readTime: Number,                 // ✨ NEW: Estimated read time
    views: Number,                    // ✨ NEW: View count
    timestamps: true
}
```

### File Upload System
**New File:** `backend/middlewares/uploadMiddleware.js`

Configured multer for handling file uploads:
- Accepts: Images (JPG, PNG, GIF, WebP), PDFs, Word docs, Excel sheets, Text files, Audio (MP3), Video (MP4)
- Max file size: 50MB
- Max files per upload: 10
- Files stored in `/backend/uploads` directory

```javascript
import upload from '../middlewares/uploadMiddleware.js';

// Usage in routes
router.post('/posts', protect, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'files', maxCount: 10 }
]), createPost);
```

### Enhanced Create Post Page
**File:** `frontend/src/pages/CreatePost.jsx`

Features:
- ✨ **Cover Image Upload** - Drag & drop or click to upload cover image
- ✨ **Post Description** - Short excerpt/summary of the post
- ✨ **Tags System** - Add comma-separated tags for categorization
- ✨ **File Attachments** - Attach up to 10 files (PDFs, docs, images, etc.)
- ✨ **Live Read Time Calculation** - Shows estimated read time based on word count
- ✨ **Word Counter** - Real-time word count display
- ✨ **Preview Mode** - See how your post will look before publishing
- ✨ **Better UI** - Modern Medium-inspired interface with dark mode support

```jsx
// Create post with all new features
const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
formData.append('content', content);
formData.append('tags', tags.split(',').map(t => t.trim()));
formData.append('coverImage', coverImage);

attachedFiles.forEach(file => {
    formData.append('files', file);
});

await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Enhanced Post Card
**File:** `frontend/src/components/PostCard.jsx`

New features:
- ✨ **Cover Image Display** - Shows post cover image with hover effects
- ✨ **Read Time Badge** - Displays "10 min read" format
- ✨ **Tags Display** - Shows up to 3 tags with +X more indicator
- ✨ **Description Preview** - Shows post description under title
- ✨ **View Counter** - Shows number of views
- ✨ **Better Date Display** - "Today", "Yesterday", "3d ago" format
- ✨ **Enhanced Styling** - Card-based design with better visual hierarchy

### Updated Post Controller
**File:** `backend/controllers/postController.js`

Enhanced createPost function:
```javascript
export const createPost = async (req, res) => {
    // Automatic read time calculation
    const wordCount = req.body.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Handle cover image upload
    if (req.files?.coverImage) {
        postData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    // Handle attached files
    if (req.files?.files) {
        postData.files = req.files.files.map(file => ({
            filename: file.originalname,
            url: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            size: file.size
        }));
    }
};
```

### Updated Backend Server
**File:** `backend/server.js`

Added:
- Static file serving for uploaded files
- Increased JSON payload size limit (50MB)
- URL-encoded payload support

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

---

## 📋 Installation & Setup

### Backend Dependencies
Ensure these packages are installed:
```bash
cd backend
npm install multer express mongoose bcryptjs jsonwebtoken dotenv cors
```

### Environment Variables (.env)
```
MONGO_URI=mongodb://localhost:27017/miniblog
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Frontend Dependencies
```bash
cd frontend
npm install axios react-hot-toast framer-motion lucide-react
```

---

## 🎯 Usage Examples

### Creating a Post with Files

1. **Upload Cover Image**: Click the cover image area or drag & drop
2. **Add Title**: Enter your post title
3. **Add Description**: Write a compelling short summary
4. **Write Content**: Use Markdown for formatting
5. **Add Tags**: Use comma-separated tags (e.g., "tech, javascript, tutorial")
6. **Attach Files**: Click "Attach Files" to add up to 10 files
7. **Preview**: Click the eye icon to see how your post looks
8. **Publish**: Click the Publish button

### File Types Supported
- **Images**: JPG, PNG, GIF, WebP
- **Documents**: PDF, Word (.docx), Excel (.xlsx), Text
- **Media**: MP3 (audio), MP4 (video)

---

## 🔒 Security Features

- JWT authentication on all protected routes
- File type validation (whitelist approach)
- File size limits (50MB max per file)
- User authorization checks (users can only edit/delete their own posts)
- Password hashing with bcrypt

---

## 🎨 UI Enhancements

- Dark mode support throughout
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Glassmorphic card designs
- Real-time statistics (read time, word count, views)
- Toast notifications for user feedback

---

## 🚀 API Endpoints

### Auth Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protected)
```

### Post Endpoints
```
GET    /api/posts
POST   /api/posts (protected, with file upload)
GET    /api/posts/:id
PUT    /api/posts/:id (protected)
DELETE /api/posts/:id (protected)
PUT    /api/posts/:id/like (protected)
POST   /api/posts/:id/comment (protected)
```

---

## 📝 Notes

- Posts calculate read time automatically (200 words/minute average)
- Cover images are served from `/uploads` directory
- All timestamps are in UTC
- File uploads are limited to 50MB per file, 10 files per post
- Tags are case-insensitive for better organization

---

## 🐛 Troubleshooting

**Issue:** "Cannot find module 'multer'"
- **Solution:** Run `npm install multer` in backend folder

**Issue:** File uploads not working
- **Solution:** Ensure `/backend/uploads` directory exists and has write permissions

**Issue:** Images not displaying after upload
- **Solution:** Verify backend is serving `/uploads` endpoint correctly

**Issue:** Login/Register errors
- **Solution:** Check `.env` file has correct `MONGO_URI` and `JWT_SECRET`

---

Created: January 26, 2026
Last Updated: January 26, 2026
