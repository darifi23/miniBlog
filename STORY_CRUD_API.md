# Story CRUD API Documentation

## Base URL
`http://localhost:5000/api/stories`

---

## 📝 CREATE - Create a New Story

### Endpoint
```
POST /api/stories
```

### Authentication
✅ Required (Bearer Token)

### Request Body
```json
{
  "title": "My Awesome Story",
  "content": "This is the full content of my story...",
  "description": "A brief description of the story",
  "tags": ["adventure", "fiction"]
}
```

### With Cover Image
Use `FormData` with multipart/form-data:
```
POST /api/stories (multipart/form-data)
- title: "My Story"
- content: "Story content..."
- description: "Brief description"
- tags: ["tag1", "tag2"]
- coverImage: <image file>
```

### Response (201 Created)
```json
{
  "_id": "story123",
  "title": "My Awesome Story",
  "content": "This is the full content...",
  "description": "A brief description",
  "author": {
    "_id": "user123",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "tags": ["adventure", "fiction"],
  "readTime": 5,
  "likes": [],
  "views": 0,
  "published": true,
  "createdAt": "2024-01-28T10:30:00Z",
  "updatedAt": "2024-01-28T10:30:00Z"
}
```

---

## 📖 READ - Get All Stories

### Endpoint
```
GET /api/stories
```

### Authentication
❌ Not Required

### Query Parameters
- `published` (optional): `true` or `false` to filter by published status

### Example
```
GET /api/stories?published=true
```

### Response (200 OK)
```json
[
  {
    "_id": "story123",
    "title": "My Awesome Story",
    "description": "A brief description",
    "author": {
      "_id": "user123",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "readTime": 5,
    "views": 42,
    "likes": ["user456", "user789"],
    "createdAt": "2024-01-28T10:30:00Z"
  },
  ...
]
```

---

## 📖 READ - Get Single Story by ID

### Endpoint
```
GET /api/stories/:id
```

### Authentication
❌ Not Required

### URL Parameters
- `id`: Story ID

### Example
```
GET /api/stories/story123
```

### Response (200 OK)
```json
{
  "_id": "story123",
  "title": "My Awesome Story",
  "content": "Full content...",
  "description": "A brief description",
  "author": {
    "_id": "user123",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "tags": ["adventure"],
  "readTime": 5,
  "views": 43,
  "likes": ["user456"],
  "published": true,
  "createdAt": "2024-01-28T10:30:00Z"
}
```

---

## 📖 READ - Get User's Stories

### Endpoint
```
GET /api/stories/user/stories
```

### Authentication
✅ Required (Bearer Token)

### Response (200 OK)
```json
[
  {
    "_id": "story123",
    "title": "My First Story",
    ...
  },
  {
    "_id": "story456",
    "title": "My Second Story",
    ...
  }
]
```

---

## ✏️ UPDATE - Update a Story

### Endpoint
```
PUT /api/stories/:id
```

### Authentication
✅ Required (Bearer Token)

### URL Parameters
- `id`: Story ID

### Request Body
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "description": "Updated description",
  "tags": ["updated", "tags"],
  "published": true
}
```

### Authorization
Only the story author can update their story

### Response (200 OK)
```json
{
  "_id": "story123",
  "title": "Updated Title",
  "content": "Updated content...",
  ...
}
```

---

## 🗑️ DELETE - Delete a Story

### Endpoint
```
DELETE /api/stories/:id
```

### Authentication
✅ Required (Bearer Token)

### URL Parameters
- `id`: Story ID

### Authorization
Only the story author can delete their story

### Response (200 OK)
```json
{
  "message": "Story deleted successfully",
  "id": "story123"
}
```

---

## ❤️ LIKE/UNLIKE - Toggle Like on a Story

### Endpoint
```
POST /api/stories/:id/like
```

### Authentication
✅ Required (Bearer Token)

### URL Parameters
- `id`: Story ID

### Request Body
(Empty - no body needed)

### Response (200 OK)
```json
{
  "_id": "story123",
  "title": "My Awesome Story",
  "likes": ["user456", "user123"],
  ...
}
```

---

## 🧪 Testing Examples

### Using Axios (Frontend)
```javascript
import api from './api/axios'; // This already includes auth token

// CREATE
const response = await api.post('/stories', {
  title: 'My Story',
  content: 'Story content...',
  description: 'Brief description',
  tags: ['tag1', 'tag2']
});

// READ ALL
const stories = await api.get('/stories');

// READ ONE
const story = await api.get('/stories/story123');

// READ USER'S STORIES
const myStories = await api.get('/stories/user/stories');

// UPDATE
await api.put('/stories/story123', {
  title: 'Updated Title',
  content: 'Updated content...'
});

// DELETE
await api.delete('/stories/story123');

// LIKE
await api.post('/stories/story123/like');
```

### Using curl (Terminal)
```bash
# CREATE
curl -X POST http://localhost:5000/api/stories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Story","content":"Content...","tags":["tag1"]}'

# READ ALL
curl http://localhost:5000/api/stories

# READ ONE
curl http://localhost:5000/api/stories/story123

# UPDATE
curl -X PUT http://localhost:5000/api/stories/story123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","content":"New content..."}'

# DELETE
curl -X DELETE http://localhost:5000/api/stories/story123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# LIKE
curl -X POST http://localhost:5000/api/stories/story123/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Title and content are required"
}
```

### 401 Unauthorized
```json
{
  "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to update this story"
}
```

### 404 Not Found
```json
{
  "message": "Story not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error creating story",
  "error": "Error details..."
}
```
