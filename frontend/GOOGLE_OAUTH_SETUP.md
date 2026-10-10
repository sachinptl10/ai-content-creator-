# Google Authenticator Login Setup Guide

## 📋 Overview

This guide will help you set up Google OAuth login for your ViralIQ application. The implementation includes a responsive, interactive Google login button on your login page.

## ✅ What's Been Added

1. **Google OAuth Button** - Responsive, interactive login button
2. **AuthContext Integration** - Backend support for Google OAuth
3. **Styling** - Mobile-responsive design with smooth animations
4. **Error Handling** - User-friendly error messages

## 🔧 Step 1: Get Your Google Client ID

### Option A: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API**:
   - Search for "Google+ API" in the search bar
   - Click on it and press **Enable**
4. Create OAuth 2.0 Credentials:
   - Go to **Credentials** in the left sidebar
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized origins:
     - `http://localhost:3000` (for local development)
     - `http://localhost:5173` (for Vite dev server)
     - `https://ai-content-creator-self.vercel.app` (your production domain)
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google-callback`
     - `http://localhost:5173/auth/google-callback`
     - `https://ai-content-creator-self.vercel.app/auth/google-callback`
5. Copy your **Client ID** from the credentials

### Option B: Quick OAuth Setup

1. Visit [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Use it to quickly get a Client ID for testing

## 📝 Step 2: Configure Environment Variables

### Frontend (.env file)

Create a `.env` file in your `frontend` directory:

```bash
# Copy .env.example as starting point
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000
```

### Backend Setup

Your backend needs to handle Google OAuth tokens. Create an endpoint at `/auth/google-login` that:

1. Receives the Google token from the frontend
2. Verifies the token using Google's API
3. Creates or finds the user
4. Returns a JWT token for your app

Example backend implementation (Node.js/Express):

```javascript
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google-login', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user in your database
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
        googleId,
        password: 'oauth', // Mark as OAuth user
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid Google token' },
    });
  }
});
```

## 🎨 What the Google Button Looks Like

### Desktop
- Full-width button with Google branding
- Smooth hover effects with elevation
- Loading state support
- Error message display

### Mobile
- Touch-optimized (48px height on mobile)
- Full-width on screens < 768px
- Responsive text sizing
- Maintained spacing and padding

## 🔄 User Flow

1. User clicks the Google Login button
2. Google sign-in popup appears
3. User authenticates with their Google account
4. Frontend receives Google token
5. Frontend sends token to your backend
6. Backend verifies token and creates/finds user
7. Backend returns JWT token
8. Frontend stores token and redirects to dashboard

## 📱 Responsive Breakpoints

| Breakpoint | Changes |
|-----------|---------|
| Desktop (> 768px) | Full styling with hover effects |
| Tablet (481-768px) | Adjusted padding and font sizes |
| Mobile (< 480px) | Optimized touch targets (48px min) |

## 🎯 Features Implemented

✅ **Interactive Button**
- Hover animations
- Click feedback
- Loading states

✅ **Responsive Design**
- Mobile-first approach
- Touch-friendly on all devices
- Adaptive spacing

✅ **Error Handling**
- User-friendly error messages
- Network error detection
- Token validation

✅ **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance

## 🚀 Testing

### Local Testing

1. Start your Vite dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:5173/login`

3. Click the Google Login button

4. After authentication, you should be redirected to the dashboard

### Production Testing (Vercel)

1. Deploy to Vercel with environment variables set
2. Make sure your Google OAuth credentials include your Vercel domain
3. Test the login flow on the live site

## ⚙️ Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456.apps.googleusercontent.com` |
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000` |

## 🐛 Troubleshooting

### "Google is not defined" error
- Make sure `GoogleOAuthProvider` wraps your app in `App.jsx`
- Check that `VITE_GOOGLE_CLIENT_ID` is set

### Google button not showing
- Check browser console for errors
- Verify `@react-oauth/google` is installed: `npm list @react-oauth/google`
- Ensure environment variables are loaded

### "Invalid token" from backend
- Verify your `GOOGLE_CLIENT_ID` on backend matches frontend
- Check token expiration
- Ensure Google API is enabled in your GCP project

### CORS errors
- Add your domain to Google OAuth authorized origins
- Check backend CORS configuration
- Verify API endpoint is accessible

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Package](https://github.com/react-oauth/react-oauth.js)
- [Google Cloud Console](https://console.cloud.google.com)

## ✨ Customization

### Change Button Colors

Edit the CSS in `src/index.css`:

```css
.google-login-container button {
  background: linear-gradient(135deg, #4285F4 0%, #1967D2 100%) !important;
}
```

### Change Button Size

```css
.google-login-container button {
  height: 48px !important;
  font-size: 15px !important;
}
```

### Disable Button Theme Override

Remove the `theme="dark"` prop from the `GoogleLogin` component in `src/pages/Login.jsx`

## 🔐 Security Notes

- Never expose your `GOOGLE_CLIENT_ID` in git commits
- Always validate tokens on the backend
- Use HTTPS in production
- Store tokens securely (use httpOnly cookies if possible)
- Implement token refresh logic for better UX

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Review the backend logs for server-side errors
4. Check Google Cloud Console for project settings

---

**Last Updated:** 2026-07-18
**Package Version:** @react-oauth/google ^0.12.0
