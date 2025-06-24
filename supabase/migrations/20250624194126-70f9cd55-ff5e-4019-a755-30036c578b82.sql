
-- Campaign master table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  go_live DATE,
  period_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly KPI table with unique constraint to prevent duplicates
CREATE TABLE IF NOT EXISTS roi_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  kpi TEXT,
  year INTEGER,
  month INTEGER,   -- 1-12
  week INTEGER,    -- 1-4
  target NUMERIC,
  achieved NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT roi_weeks_unique UNIQUE (campaign_id, kpi, year, month, week)
);

-- Enable RLS for security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_weeks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - adjust as needed)
CREATE POLICY "Allow all operations on campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on roi_weeks" ON roi_weeks FOR ALL USING (true);
