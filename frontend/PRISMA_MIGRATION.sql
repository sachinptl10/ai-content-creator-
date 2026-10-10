-- Database Schema Updates for Google OAuth

-- Add these fields to your User model in schema.prisma if they don't exist:

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  password     String?  // Make optional for OAuth users
  avatar       String?  // NEW: Store Google profile picture
  googleId     String?  @unique // NEW: Google unique identifier
  provider     String?  // NEW: "google", "email", "github", etc
  plan         String   @default("free")
  credits      Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

-- Migration commands:

# Generate the migration file
npx prisma migrate dev --name add_google_oauth

# If you prefer to use plain SQL, run directly:
# For SQLite:
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN "googleId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "provider" TEXT;

# Make password optional if needed:
ALTER TABLE "User" MODIFY password TEXT NULL;

# For PostgreSQL:
ALTER TABLE "User" ADD COLUMN avatar TEXT;
ALTER TABLE "User" ADD COLUMN "googleId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN provider TEXT;
ALTER TABLE "User" ALTER COLUMN password DROP NOT NULL;

# Then regenerate Prisma client:
npx prisma generate
