-- Migration: Add surveys table
CREATE TABLE IF NOT EXISTS surveys (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    "satisfactionRating" INTEGER NOT NULL,
    "easeOfUseRating" INTEGER NOT NULL,
    "wouldRecommend" BOOLEAN NOT NULL,
    comments TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on createdAt for faster queries
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys("createdAt" DESC);
