# Security Instructions for GitHub Copilot

When generating code for this project, follow these security guidelines:

## Input Validation

### Always Validate User Input

```typescript
// Good: Validate and sanitize
function createUser(userData: unknown): User {
  // Validate input structure
  if (!userData || typeof userData !== 'object') {
    throw new ValidationError('Invalid user data');
  }

  // Validate required fields
  const { email, name } = userData as Record<string, unknown>;
  
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  if (!name || typeof name !== 'string' || name.length > 100) {
    throw new ValidationError('Invalid name');
  }

  // Sanitize before use
  return {
    email: sanitizeEmail(email),
    name: sanitizeString(name),
  };
}

// Bad: Trusting user input
function createUser(userData: any): User {
  return {
    email: userData.email,
    name: userData.name,
  };
}
```

### Input Validation Rules
- ✅ Validate type, format, length, and range
- ✅ Use allowlists (permitted values) over denylists
- ✅ Sanitize HTML/SQL inputs
- ✅ Validate on both client and server
- ❌ Never trust client-side validation alone

## Authentication & Authorization

### Password Security

```typescript
import bcrypt from 'bcrypt';

// Good: Hash passwords
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Bad: Storing plain text passwords
function savePassword(password: string) {
  user.password = password; // Never do this!
}
```

### Token Management

```typescript
// Good: Secure token handling
import jwt from 'jsonwebtoken';

function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!, // From environment variable
    { expiresIn: '1h' }
  );
}

function verifyToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
}

// Bad: Weak token security
function generateToken(userId: string): string {
  return Buffer.from(userId).toString('base64'); // Not secure!
}
```

## Protecting Sensitive Data

### Never Hardcode Secrets

```typescript
// Good: Use environment variables
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

if (!apiKey || !dbPassword) {
  throw new Error('Missing required environment variables');
}

// Bad: Hardcoded secrets
const apiKey = 'sk-1234567890abcdef'; // Never do this!
const dbPassword = 'MyPassword123'; // Never do this!
```

### Secure Configuration

```typescript
// .env file (never commit this!)
API_KEY=your-secret-key
DB_PASSWORD=your-db-password

// .gitignore (always include)
.env
.env.local
*.key
*.pem
secrets/
```

### Logging Safely

```typescript
// Good: Sanitize logs
function logUserAction(user: User, action: string) {
  logger.info('User action', {
    userId: user.id,
    action,
    // Don't log sensitive fields
  });
}

// Bad: Logging sensitive data
function logUserAction(user: User, action: string) {
  logger.info('User action', {
    user, // May contain password, tokens, etc.
    action,
  });
}
```

## SQL Injection Prevention

### Use Parameterized Queries

```typescript
// Good: Parameterized query
async function getUser(userId: string): Promise<User> {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [user] = await db.query(query, [userId]);
  return user;
}

// Bad: String concatenation
async function getUser(userId: string): Promise<User> {
  const query = `SELECT * FROM users WHERE id = '${userId}'`; // SQL injection risk!
  const [user] = await db.query(query);
  return user;
}
```

### Using ORM/Query Builders

```typescript
// Good: ORM with parameterized queries
const user = await User.findOne({
  where: { id: userId }
});

// Good: Query builder
const user = await db('users')
  .where('id', userId)
  .first();
```

## XSS Prevention

### Sanitize Output

```typescript
// Good: Escape HTML
import escapeHtml from 'escape-html';

function renderUserComment(comment: string): string {
  return `<div class="comment">${escapeHtml(comment)}</div>`;
}

// Bad: Direct interpolation
function renderUserComment(comment: string): string {
  return `<div class="comment">${comment}</div>`; // XSS risk!
}
```

### Content Security Policy

```typescript
// Set CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

## CSRF Protection

```typescript
import csrf from 'csurf';

// Enable CSRF protection
const csrfProtection = csrf({ cookie: true });

app.post('/api/user', csrfProtection, (req, res) => {
  // Handle request with CSRF token validation
});
```

## Secure HTTP Headers

```typescript
import helmet from 'helmet';

// Use helmet for secure HTTP headers
app.use(helmet());

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Limit requests to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);
```

## Dependency Security

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Use Security Tools

```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "check-updates": "npx npm-check-updates"
  }
}
```

## File Upload Security

```typescript
import multer from 'multer';
import path from 'path';

// Good: Validate file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});
```

## API Security

### HTTPS Only

```typescript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### Authentication Middleware

```typescript
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Protect routes
app.get('/api/protected', requireAuth, (req, res) => {
  // Handle protected route
});
```

## Security Checklist

- [ ] Validate all user inputs
- [ ] Use parameterized queries
- [ ] Hash passwords with bcrypt/argon2
- [ ] Store secrets in environment variables
- [ ] Enable HTTPS in production
- [ ] Set secure HTTP headers
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize output to prevent XSS
- [ ] Keep dependencies updated
- [ ] Use security linters (eslint-plugin-security)
- [ ] Implement proper error handling
- [ ] Log security events
- [ ] Regular security audits
