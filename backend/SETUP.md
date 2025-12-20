# TruckFlow Authentication Setup Guide

## Authentication Flow

1. **Login Process**:
   - User enters username/password
   - System validates credentials and checks for account lockout
   - If 2FA enabled, user must provide TOTP code
   - JWT token issued on successful authentication
   - Session tracked with inactivity timeout

2. **Security Features**:
   - Password hashing with bcrypt (12 rounds)
   - Rate limiting (5 login attempts per 15 minutes)
   - Account lockout after 5 failed attempts (30 minutes)
   - TOTP-based 2FA using Google Authenticator
   - Secure session management with JWT
   - Audit logging for all authentication events

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  action: String (enum),
  ipAddress: String,
  userAgent: String,
  details: Mixed,
  timestamp: Date
}
```

## Installation & Setup

1. **Install Backend Dependencies**:
```bash
cd backend
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Gmail SMTP Setup**:
   - Enable 2-Step Verification on Gmail
   - Generate App Password: Google Account → Security → App passwords
   - Use the 16-character app password in GMAIL_APP_PASSWORD

4. **Database Setup**:
```bash
# Start MongoDB
mongod

# Create admin user
npm run seed
```

5. **Start Services**:
```bash
# Backend
npm run dev

# Frontend (separate terminal)
cd ../
npm start
```

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/truckflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
```

## Security Best Practices

1. **Password Security**:
   - Minimum 8 characters
   - Bcrypt hashing with 12 rounds
   - No password transmission in emails

2. **Session Management**:
   - JWT tokens with expiration
   - Secure HTTP-only cookies
   - Session invalidation on password reset

3. **Rate Limiting**:
   - Login: 5 attempts per 15 minutes
   - Password reset: 3 attempts per hour
   - Account lockout: 30 minutes after 5 failed attempts

4. **Audit Trail**:
   - All authentication events logged
   - IP address and user agent tracking
   - Failed attempt monitoring

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/setup-2fa` - Setup 2FA
- `POST /api/auth/verify-2fa` - Verify and enable 2FA
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

## Default Admin Account

- Username: `admin`
- Password: `TruckFlow2024!`
- **Change immediately after first login**

## Troubleshooting

1. **Gmail SMTP Issues**:
   - Verify 2-Step Verification is enabled
   - Use App Password, not regular password
   - Check "Less secure app access" if needed

2. **MongoDB Connection**:
   - Ensure MongoDB is running
   - Check connection string in .env

3. **JWT Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration settings