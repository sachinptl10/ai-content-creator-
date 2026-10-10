import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Verify Google Token using Google's tokeninfo endpoint
export const verifyGoogleToken = async (token) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + token);

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();

    // Verify the audience (client ID)
    if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Token audience mismatch');
    }

    return {
      googleId: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Invalid Google token');
  }
};

// Google Login Controller
export const googleLogin = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Google token is required',
      },
    });
  }

  try {
    // Verify the Google token
    const googleProfile = await verifyGoogleToken(token);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleProfile.email },
    });

    if (!user) {
      // Create new user from Google profile
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: googleProfile.email,
          name: googleProfile.name || 'Google User',
          password: 'oauth-google', // Mark as OAuth user
          plan: 'pro',
          credits: 999999,
          googleId: googleProfile.googleId,
          avatar: googleProfile.picture,
          provider: 'google',
        },
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if not already set
      user = await prisma.user.update({
        where: { email: googleProfile.email },
        data: {
          googleId: googleProfile.googleId,
          avatar: googleProfile.picture || user.avatar,
          provider: 'google',
        },
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        provider: user.provider || 'google',
      },
      process.env.JWT_SECRET || 'viraliq_fallback_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          avatar: user.avatar,
          provider: user.provider,
        },
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || 'Google authentication failed',
      },
    });
  }
};
