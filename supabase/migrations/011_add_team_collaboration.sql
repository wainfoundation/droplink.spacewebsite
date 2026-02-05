-- Add team collaboration functionality
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{
    "allowInvites": true,
    "requireApproval": false,
    "maxMembers": 10,
    "defaultRole": "viewer"
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Add RLS policies for teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teams they own or are members of" ON teams
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update teams they own" ON teams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete teams they own" ON teams
  FOR DELETE USING (auth.uid() = owner_id);

-- Add trigger for teams updated_at
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_teams_updated_at();

-- Add team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'active',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Add RLS policies for team members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members of their teams" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can insert team members to their teams" ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update team members of their teams" ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete team members of their teams" ON team_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

-- Add trigger for team members updated_at
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at();

-- Add team invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token VARCHAR(100) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for team invites
CREATE INDEX IF NOT EXISTS idx_team_invites_team_id ON team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON team_invites(email);
CREATE INDEX IF NOT EXISTS idx_team_invites_token ON team_invites(token);
CREATE INDEX IF NOT EXISTS idx_team_invites_status ON team_invites(status);

-- Add RLS policies for team invites
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invites for their teams" ON team_invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_invites.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert invites for their teams" ON team_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_invites.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invites for their teams" ON team_invites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_invites.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete invites for their teams" ON team_invites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_invites.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

-- Add shared links table
CREATE TABLE IF NOT EXISTS shared_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permissions JSONB NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for shared links
CREATE INDEX IF NOT EXISTS idx_shared_links_link_id ON shared_links(link_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_team_id ON shared_links(team_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_shared_by ON shared_links(shared_by);

-- Add RLS policies for shared links
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shared links of their teams" ON shared_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = shared_links.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can insert shared links to their teams" ON shared_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = shared_links.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can update shared links of their teams" ON shared_links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = shared_links.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can delete shared links of their teams" ON shared_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = shared_links.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

-- Add team activities table
CREATE TABLE IF NOT EXISTS team_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for team activities
CREATE INDEX IF NOT EXISTS idx_team_activities_team_id ON team_activities(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_user_id ON team_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_timestamp ON team_activities(timestamp);

-- Add RLS policies for team activities
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities of their teams" ON team_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_activities.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can insert activities for their teams" ON team_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_activities.team_id 
      AND (teams.owner_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM team_members tm 
             WHERE tm.team_id = teams.id 
             AND tm.user_id = auth.uid()
           ))
    )
  );
