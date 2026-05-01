import { useMemo } from 'react';
import useWorkspaceStore from '@/store/workspaceStore';
import useAuthStore from '@/store/authStore';

export const PERMISSIONS = {
  CREATE_GOAL: 'create_goal',
  UPDATE_GOAL: 'update_goal',
  DELETE_GOAL: 'delete_goal',
  POST_ANNOUNCEMENT: 'post_announcement',
  INVITE_MEMBER: 'invite_member',
  MANAGE_WORKSPACE: 'manage_workspace_settings'
};

const ROLE_PERMISSIONS = {
  ADMIN: [
    PERMISSIONS.CREATE_GOAL,
    PERMISSIONS.UPDATE_GOAL,
    PERMISSIONS.DELETE_GOAL,
    PERMISSIONS.POST_ANNOUNCEMENT,
    PERMISSIONS.INVITE_MEMBER,
    PERMISSIONS.MANAGE_WORKSPACE
  ],
  MEMBER: [
    PERMISSIONS.CREATE_GOAL,
    PERMISSIONS.UPDATE_GOAL,
    PERMISSIONS.POST_ANNOUNCEMENT
  ]
};

export const usePermission = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();

  const userRole = useMemo(() => {
    if (!activeWorkspace || !user) return null;
    const membership = activeWorkspace.members?.find(m => m.userId === user.id);
    return membership?.role || null;
  }, [activeWorkspace, user]);

  const can = (permission) => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
  };

  return { can, role: userRole };
};
