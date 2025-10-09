-- Fittober Fitness Tracker Database Schema
-- PostgreSQL database setup for tracking team fitness activities

-- Create the activities table
CREATE TABLE IF NOT EXISTS activities (
  uid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id TEXT NOT NULL,
  member TEXT NOT NULL,
  activity TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  ts TIMESTAMPTZ NOT NULL,
  device_team TEXT NOT NULL DEFAULT 'Fittober',
  source_gist TEXT NOT NULL,
  raw_json JSONB NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure no duplicate logs from the same source
  UNIQUE (log_id, source_gist)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activities_member ON activities(member);
CREATE INDEX IF NOT EXISTS idx_activities_ts ON activities(ts);
CREATE INDEX IF NOT EXISTS idx_activities_source_gist ON activities(source_gist);
CREATE INDEX IF NOT EXISTS idx_activities_inserted_at ON activities(inserted_at);

-- Create a view for easy member statistics
CREATE OR REPLACE VIEW member_stats AS
SELECT 
  member,
  COUNT(*) as total_activities,
  SUM(duration_min) as total_minutes,
  AVG(duration_min) as avg_duration,
  MIN(ts) as first_activity,
  MAX(ts) as last_activity
FROM activities
GROUP BY member
ORDER BY total_minutes DESC;

-- Create a view for daily activity summaries
CREATE OR REPLACE VIEW daily_activity_summary AS
SELECT 
  DATE(ts) as activity_date,
  member,
  COUNT(*) as activities_count,
  SUM(duration_min) as total_minutes
FROM activities
GROUP BY DATE(ts), member
ORDER BY activity_date DESC, total_minutes DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE activities TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
