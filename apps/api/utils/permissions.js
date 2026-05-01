const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

const PERMISSIONS = {
  CREATE_GOAL: 'create_goal',
  UPDATE_GOAL: 'update_goal',
  DELETE_GOAL: 'delete_goal',
  POST_ANNOUNCEMENT: 'post_announcement',
  INVITE_MEMBER: 'invite_member',
  MANAGE_WORKSPACE: 'manage_workspace_settings'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_GOAL,
    PERMISSIONS.UPDATE_GOAL,
    PERMISSIONS.DELETE_GOAL,
    PERMISSIONS.POST_ANNOUNCEMENT,
    PERMISSIONS.INVITE_MEMBER,
    PERMISSIONS.MANAGE_WORKSPACE
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.CREATE_GOAL,
    PERMISSIONS.UPDATE_GOAL,
    PERMISSIONS.POST_ANNOUNCEMENT
  ]
};

const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission
};
