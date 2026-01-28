-- Add chapters_data column to store chapter progress
ALTER TABLE thesis_drafts 
ADD COLUMN IF NOT EXISTS chapters_data JSONB DEFAULT '{}'::jsonb;

-- Update the thesis_drafts to ensure all required columns exist
ALTER TABLE thesis_drafts 
ADD COLUMN IF NOT EXISTS fakultas TEXT,
ADD COLUMN IF NOT EXISTS jurusan TEXT,
ADD COLUMN IF NOT EXISTS peminatan TEXT;
