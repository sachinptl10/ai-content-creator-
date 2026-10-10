# 🚀 Google OAuth - Quick Reference Card

## ⚡ 5-Minute Setup

```bash
# 1. Install package
cd frontend
npm install @react-oauth/google

# 2. Get Google Client ID from:
# https://console.cloud.google.com

# 3. Create frontend/.env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000

# 4. Update backend/.env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com

# 5. Run migration
cd backend
npx prisma migrate dev --name add_google_oauth

# 6. Start servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# 7. Test at http://localhost:5173/login
```

---

## 📋 Files Modified/Created

### Modified (4 files)
```
frontend/src/App.jsx
frontend/src/pages/Login.jsx
frontend/src/context/AuthContext.jsx
frontend/src/index.css
```

### Created (1 file)
```
backend/src/controllers/google.controller.js
```

### Documentation (6 files)
```
README_GOOGLE_OAUTH.md
GOOGLE_OAUTH_SETUP.md
GOOGLE_OAUTH_QUICKSTART.md
GOOGLE_OAUTH_IMPLEMENTATION.md
GOOGLE_BUTTON_VISUAL_PREVIEW.md
PRISMA_MIGRATION.sql
```

---

## 🔑 Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `VITE_GOOGLE_CLIENT_ID` | `frontend/.env` | `YOUR_CLIENT_ID.apps.googleusercontent.com` |
| `VITE_API_URL` | `frontend/.env` | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | `backend/.env` | Same as above |
| `JWT_SECRET` | `backend/.env` | Your secret key |

---

## 🔗 API Endpoint

```
POST /auth/google-login

Request:
{
  "token": "google_id_token_here"
}

Response (Success):
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "avatar": "google_picture_url"
    }
  }
}

Response (Error):
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid Google token"
  }
}
```

---

## 💾 Database Migration

```sql
-- Add to User model in schema.prisma:
password     String?    // Make optional
avatar       String?    // NEW
googleId     String? @unique // NEW
provider     String?    // NEW

-- Run migration:
npx prisma migrate dev --name add_google_oauth
```

---

## 🎨 Key CSS Classes

```css
.auth-divider              /* "or" separator */
.google-login-container    /* Button wrapper */
.auth-card-tall            /* Login card */
.auth-container            /* Page background */
```

---

## 📱 Responsive Breakpoints

| Device | Width | Button Height | Font Size |
|--------|-------|---------------|-----------|
| Desktop | > 768px | 48px | 15px |
| Tablet | 481-768px | 44px | 14px |
| Mobile | < 480px | 42px | 13px |

---

## 🧪 Testing Checklist

- [ ] Button appears on login page
- [ ] Hover effects work
- [ ] Clicking opens Google popup
- [ ] Can authenticate with Google
- [ ] New users auto-registered
- [ ] Existing users can login
- [ ] Redirects to dashboard
- [ ] Works on mobile
- [ ] Error messages display

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| Button not showing | Check `VITE_GOOGLE_CLIENT_ID` in `.env` |
| "Invalid token" | Verify Client ID matches on backend |
| CORS errors | Add domain to Google OAuth origins |
| Login loop | Check `JWT_SECRET` is consistent |

---

## 🔐 Security Checklist

- ✅ Token verified on backend
- ✅ Google token not stored
- ✅ JWT used for auth
- ✅ User data validated
- ✅ Passwords optional for OAuth
- ⚠️ Keep secrets in `.env`
- ⚠️ Use HTTPS in production
- ⚠️ Regular security updates

---

## 📚 Documentation Map

```
README_GOOGLE_OAUTH.md (You are here!)
├── Quick Start (5 min) → GOOGLE_OAUTH_QUICKSTART.md
├── Detailed Setup (20 min) → GOOGLE_OAUTH_SETUP.md
├── Implementation → GOOGLE_OAUTH_IMPLEMENTATION.md
├── Visual Preview → GOOGLE_BUTTON_VISUAL_PREVIEW.md
└── DB Migration → PRISMA_MIGRATION.sql
```

---

## 🚀 Deployment to Vercel

```bash
# 1. Add env vars to Vercel dashboard
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
VITE_API_URL=https://your-api-domain.com

# 2. Add domain to Google OAuth settings
https://ai-content-creator-self.vercel.app

# 3. Deploy
git add .
git commit -m "Add Google OAuth"
git push origin main
```

---

## 💬 Code Snippets

### Frontend Usage
```jsx
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  theme="dark"
/>
```

### Backend Usage
```js
import { googleLogin } from './controllers/google.controller.js';

router.post('/auth/google-login', googleLogin);
```

### AuthContext Usage
```jsx
const { loginWithGoogle } = useAuth();

const handleGoogleSuccess = async (credentialResponse) => {
  const result = await loginWithGoogle(credentialResponse);
  if (result.success) {
    navigate('/dashboard');
  }
};
```

---

## 📊 User Flow

```
Login Page
    ↓
[Email/Pass] or [Google]
    ↓ (Google clicked)
Google Popup
    ↓
User Authenticates
    ↓
Frontend gets token
    ↓
Backend verifies
    ↓
Database (create or find user)
    ↓
Return JWT
    ↓
Store & Redirect
    ↓
Dashboard ✨
```

---

## 🎯 Next Steps

1. Get Google credentials
2. Set environment variables
3. Run database migration
4. Test locally
5. Deploy to Vercel
6. Monitor & maintain

---

## 📞 Quick Help

**Where to find things:**
- Google OAuth setup → `GOOGLE_OAUTH_SETUP.md`
- Quick start → `GOOGLE_OAUTH_QUICKSTART.md`
- Code changes → `GOOGLE_OAUTH_IMPLEMENTATION.md`
- UI preview → `GOOGLE_BUTTON_VISUAL_PREVIEW.md`
- Database → `PRISMA_MIGRATION.sql`

**Having issues?**
1. Check browser console for errors
2. Check backend logs
3. Verify `.env` files
4. Re-read the relevant documentation
5. Check Google Cloud Console settings

---

## ⏱️ Time Estimates

- Get credentials: 10 min
- Setup code: 5 min (already done!)
- Configure env: 2 min
- Test locally: 5 min
- Deploy: 5 min
- **Total: ~25 minutes**

---

## ✨ What You Get

✅ Google login button on login page  
✅ Automatic user registration  
✅ Secure authentication  
✅ Mobile responsive design  
✅ Error handling  
✅ Production ready  

---

**Status:** Ready to use 🚀  
**Version:** 1.0  
**Last Updated:** 2026-07-18
