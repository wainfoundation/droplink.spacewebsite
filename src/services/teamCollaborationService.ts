import { supabase } from '@/integrations/supabase/client';

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  settings: {
    allowInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
    defaultRole: TeamRole;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  email: string;
  role: TeamRole;
  permissions: TeamPermission[];
  status: 'pending' | 'active' | 'suspended';
  invitedAt: string;
  joinedAt?: string;
  invitedBy: string;
}

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface TeamPermission {
  resource: 'links' | 'analytics' | 'settings' | 'billing' | 'members';
  actions: ('read' | 'write' | 'delete' | 'invite')[];
}

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  permissions: TeamPermission[];
  invitedBy: string;
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface SharedLink {
  id: string;
  linkId: string;
  teamId: string;
  sharedBy: string;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canViewAnalytics: boolean;
  };
  sharedAt: string;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  timestamp: string;
}

class TeamCollaborationService {
  private static instance: TeamCollaborationService;

  public static getInstance(): TeamCollaborationService {
    if (!TeamCollaborationService.instance) {
      TeamCollaborationService.instance = new TeamCollaborationService();
    }
    return TeamCollaborationService.instance;
  }

  // Team Management
  public async createTeam(
    ownerId: string,
    teamData: Omit<Team, 'id' | 'ownerId' | 'members' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: Team; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          owner_id: ownerId,
          ...teamData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add owner as team member
      await this.addTeamMember(data.id, ownerId, 'owner', []);

      return { success: true, data: data as Team };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getTeams(userId: string): Promise<{ success: boolean; data?: Team[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            *,
            user:profiles!team_members_user_id_fkey (*)
          )
        `)
        .or(`owner_id.eq.${userId},team_members.user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Team[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateTeam(
    teamId: string,
    updates: Partial<Team>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', teamId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async deleteTeam(teamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Team Member Management
  public async addTeamMember(
    teamId: string,
    userId: string,
    role: TeamRole,
    permissions: TeamPermission[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
          permissions,
          status: 'active',
          invited_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
          invited_by: userId
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async inviteTeamMember(
    teamId: string,
    email: string,
    role: TeamRole,
    permissions: TeamPermission[],
    invitedBy: string
  ): Promise<{ success: boolean; data?: TeamInvite; error?: string }> {
    try {
      const token = this.generateInviteToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { data, error } = await supabase
        .from('team_invites')
        .insert({
          team_id: teamId,
          email,
          role,
          permissions,
          invited_by: invitedBy,
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Send invitation email (implement email service)
      await this.sendInviteEmail(email, token, teamId);

      return { success: true, data: data as TeamInvite };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async acceptInvite(
    token: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: invite, error: inviteError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (inviteError || !invite) {
        return { success: false, error: 'Invalid or expired invitation' };
      }

      if (new Date(invite.expires_at) < new Date()) {
        return { success: false, error: 'Invitation has expired' };
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: userId,
          email: invite.email,
          role: invite.role,
          permissions: invite.permissions,
          status: 'active',
          invited_at: invite.created_at,
          joined_at: new Date().toISOString(),
          invited_by: invite.invited_by
        });

      if (memberError) {
        return { success: false, error: memberError.message };
      }

      // Update invite status
      await supabase
        .from('team_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async removeTeamMember(
    teamId: string,
    memberId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('id', memberId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateMemberRole(
    teamId: string,
    memberId: string,
    role: TeamRole,
    permissions: TeamPermission[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          role,
          permissions,
          updated_at: new Date().toISOString()
        })
        .eq('team_id', teamId)
        .eq('id', memberId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Link Sharing
  public async shareLink(
    linkId: string,
    teamId: string,
    sharedBy: string,
    permissions: {
      canEdit: boolean;
      canDelete: boolean;
      canViewAnalytics: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('shared_links')
        .insert({
          link_id: linkId,
          team_id: teamId,
          shared_by: sharedBy,
          permissions,
          shared_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getSharedLinks(
    teamId: string
  ): Promise<{ success: boolean; data?: SharedLink[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('shared_links')
        .select(`
          *,
          link:links (*),
          shared_by_user:profiles!shared_links_shared_by_fkey (*)
        `)
        .eq('team_id', teamId)
        .order('shared_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as SharedLink[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async unshareLink(
    linkId: string,
    teamId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('shared_links')
        .delete()
        .eq('link_id', linkId)
        .eq('team_id', teamId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Activity Tracking
  public async logActivity(
    teamId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('team_activities')
        .insert({
          team_id: teamId,
          user_id: userId,
          action,
          resource,
          resource_id: resourceId,
          details,
          timestamp: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getTeamActivity(
    teamId: string,
    limit: number = 50
  ): Promise<{ success: boolean; data?: TeamActivity[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('team_activities')
        .select(`
          *,
          user:profiles!team_activities_user_id_fkey (*)
        `)
        .eq('team_id', teamId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as TeamActivity[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Permission Checking
  public async checkPermission(
    userId: string,
    teamId: string,
    resource: string,
    action: string
  ): Promise<{ success: boolean; hasPermission: boolean; error?: string }> {
    try {
      const { data: member, error } = await supabase
        .from('team_members')
        .select('role, permissions')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error || !member) {
        return { success: true, hasPermission: false };
      }

      // Owner has all permissions
      if (member.role === 'owner') {
        return { success: true, hasPermission: true };
      }

      // Check specific permissions
      const hasPermission = member.permissions.some((permission: TeamPermission) => 
        permission.resource === resource && 
        permission.actions.includes(action as any)
      );

      return { success: true, hasPermission };
    } catch (error) {
      return { 
        success: false, 
        hasPermission: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Helper Methods
  private generateInviteToken(): string {
    return `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendInviteEmail(
    email: string,
    token: string,
    teamId: string
  ): Promise<void> {
    // Implement email service integration
    const inviteUrl = `${window.location.origin}/team/invite/${token}`;
    
    // This would integrate with an email service like SendGrid, AWS SES, etc.
    console.log(`Sending invite email to ${email} with URL: ${inviteUrl}`);
  }

  public getDefaultPermissions(role: TeamRole): TeamPermission[] {
    const permissions: Record<TeamRole, TeamPermission[]> = {
      owner: [
        { resource: 'links', actions: ['read', 'write', 'delete'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'settings', actions: ['read', 'write'] },
        { resource: 'billing', actions: ['read', 'write'] },
        { resource: 'members', actions: ['read', 'write', 'delete', 'invite'] }
      ],
      admin: [
        { resource: 'links', actions: ['read', 'write', 'delete'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'settings', actions: ['read', 'write'] },
        { resource: 'members', actions: ['read', 'write', 'invite'] }
      ],
      editor: [
        { resource: 'links', actions: ['read', 'write'] },
        { resource: 'analytics', actions: ['read'] }
      ],
      viewer: [
        { resource: 'links', actions: ['read'] },
        { resource: 'analytics', actions: ['read'] }
      ]
    };

    return permissions[role] || [];
  }
}

export const teamCollaborationService = TeamCollaborationService.getInstance();
