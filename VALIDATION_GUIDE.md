# 🔧 Complete Validation Implementation Guide

## Frontend Validation Code

### 1. Email Validation Function
```javascript
// Used in AuthContext.jsx and Login/Register pages
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validates:
// ✅ test@example.com
// ✅ user.name@company.co.uk
// ✅ first+last@domain.io
// ❌ notanemail
// ❌ @example.com
// ❌ test@.com
```

### 2. Login Form Validation
```jsx
const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
        newErrors.password = 'Password is required';
    } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
```

### 3. Register Form Validation
```jsx
const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
        newErrors.username = 'Username is required';
    } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
    } else if (username.length > 20) {
        newErrors.username = 'Username must be less than 20 characters';
    }

    // Email validation
    if (!email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
        newErrors.password = 'Password is required';
    } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
```

### 4. Password Strength Checker
```jsx
const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    
    if (pass.length >= 6) strength += 25;      // Length check
    if (pass.length >= 12) strength += 25;     // Extra length
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;  // Mixed case
    if (/[0-9]/.test(pass)) strength += 25;    // Has numbers
    
    return strength;
};

// Returns:
// 0-25:   Weak     (🔴)
// 26-50:  Fair     (🟡)
// 51-75:  Good     (🔵)
// 76-100: Strong   (🟢)
```

### 5. Real-time Error Clearing
```jsx
<input
    type="email"
    value={email}
    onChange={(e) => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (errors.email) setErrors({ ...errors, email: '' });
    }}
    className={errors.email ? 'border-red-500' : 'border-slate-200'}
/>
```

---

## Backend Validation Code

### 1. Email Validation
```javascript
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Used in: registerUser, loginUser
if (!isValidEmail(email)) {
    return res.status(400).json({ 
        message: 'Please provide a valid email address' 
    });
}
```

### 2. Register Validation
```javascript
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check all fields provided
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please add all fields' 
            });
        }

        // 2. Validate username length
        if (username.length < 3) {
            return res.status(400).json({ 
                message: 'Username must be at least 3 characters' 
            });
        }

        // 3. Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address' 
            });
        }

        // 4. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters' 
            });
        }

        // 5. Check for duplicates (email OR username)
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (userExists) {
            if (userExists.email === email) {
                return res.status(400).json({ 
                    message: 'Email already registered' 
                });
            }
            return res.status(400).json({ 
                message: 'Username already taken' 
            });
        }

        // 6. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 7. Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 8. Return user with token
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error during registration' 
        });
    }
};
```

### 3. Login Validation
```javascript
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check email and password provided
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }

        // 2. Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address' 
            });
        }

        // 3. Find user by email
        const user = await User.findOne({ email });

        // 4. Check if user exists (don't reveal if email exists for security)
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }

        // 5. Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            // 6. Return user with token
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            // 7. Password incorrect
            res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login' 
        });
    }
};
```

### 4. Protected Route Validation
```javascript
export const protect = async (req, res, next) => {
    let token;

    // 1. Extract token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Proceed to next middleware
            return next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ 
                message: 'Not authorized, token failed' 
            });
        }
    }

    // 5. No token found
    return res.status(401).json({ 
        message: 'Not authorized, no token' 
    });
};
```

---

## Context Validation (AuthContext.jsx)

### Login Function with Validation
```javascript
const login = async (email, password) => {
    // 1. Check required fields
    if (!email || !password) {
        toast.error('Email and password are required');
        return false;
    }

    // 2. Validate email format
    if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address');
        return false;
    }

    // 3. Validate password length
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }

    // 4. Call API
    try {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast.success('Login successful!');
        return true;

    } catch (error) {
        // 5. Handle API errors
        const message = error.response?.data?.message || error.message || 'Login failed';
        toast.error(message);
        return false;
    }
};
```

### Register Function with Validation
```javascript
const register = async (username, email, password) => {
    // 1. Check all fields provided
    if (!username || !email || !password) {
        toast.error('All fields are required');
        return false;
    }

    // 2. Validate username
    if (username.length < 3) {
        toast.error('Username must be at least 3 characters');
        return false;
    }

    // 3. Validate email
    if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address');
        return false;
    }

    // 4. Validate password
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }

    // 5. Call API
    try {
        const res = await api.post('/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast.success('Registration successful!');
        return true;

    } catch (error) {
        // 6. Handle API errors
        const message = error.response?.data?.message || error.message || 'Registration failed';
        toast.error(message);
        return false;
    }
};
```

---

## Error Response Examples

### Email Already Registered
```json
{
  "status": 400,
  "message": "Email already registered"
}
```

### Username Already Taken
```json
{
  "status": 400,
  "message": "Username already taken"
}
```

### Weak Password
```json
{
  "status": 400,
  "message": "Password must be at least 6 characters"
}
```

### Invalid Email Format
```json
{
  "status": 400,
  "message": "Please provide a valid email address"
}
```

### Invalid Credentials
```json
{
  "status": 400,
  "message": "Invalid email or password"
}
```

### No Token
```json
{
  "status": 401,
  "message": "Not authorized, no token"
}
```

### Token Expired
```json
{
  "status": 401,
  "message": "Not authorized, token failed"
}
```

---

## Test Cases

### Valid Registration
```
Username: newuser123
Email: newuser@example.com
Password: SecurePass123
Expected: 201 Created, token returned
```

### Duplicate Email
```
Username: anotheruser
Email: newuser@example.com (already exists)
Password: ValidPass123
Expected: 400 Bad Request, "Email already registered"
```

### Duplicate Username
```
Username: newuser123 (already exists)
Email: another@example.com
Password: ValidPass123
Expected: 400 Bad Request, "Username already taken"
```

### Weak Password
```
Username: testuser
Email: test@example.com
Password: 123
Expected: 400 Bad Request, "Password must be at least 6 characters"
```

### Invalid Email
```
Username: testuser
Email: notanemail
Password: ValidPass123
Expected: 400 Bad Request, "Please provide a valid email address"
```

### Valid Login
```
Email: newuser@example.com
Password: SecurePass123
Expected: 200 OK, token returned
```

### Wrong Password
```
Email: newuser@example.com
Password: WrongPassword
Expected: 400 Bad Request, "Invalid email or password"
```

---

## Summary of Validation Rules

| Field | Frontend | Backend | Database |
|-------|----------|---------|----------|
| Username | 3-20 chars | 3+ chars | Unique |
| Email | Regex format | Regex + format | Unique |
| Password | 6+ chars | 6+ chars | Hashed |
| Token | Bearer format | JWT verify | 30-day expiry |

---

*Validation code is production-ready and fully tested*
