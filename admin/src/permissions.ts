
const permissionOptions = {
  READ: "read",
  CHANGE: "change",
  ADMIN: "admin",
} as const;

type PermissionOptionsKeys = keyof typeof permissionOptions;
type PermissionOptionsValues = typeof permissionOptions[PermissionOptionsKeys];

type PermissionOptionString = `settings.${PermissionOptionsValues}`;
type PermissionUID = `plugin::reactions.${PermissionOptionString}`;

const permissionsUIDs: {
  settings: {
    [key in PermissionOptionsValues]: PermissionOptionString;
  }
} = {
  settings: {
    read: `settings.${permissionOptions.READ}`,
    change: `settings.${permissionOptions.CHANGE}`,
    admin: `settings.${permissionOptions.ADMIN}`,
  },
};

const permissions = {
  render: (uid: PermissionOptionString): PermissionUID => `plugin::reactions.${uid}`,
  ...permissionsUIDs,
};

export default {
  access: [
    { action: permissions.render(permissions.settings.read), subject: null },
  ],
  settings: [
    { action: permissions.render(permissions.settings.read), subject: null },
  ],
  settingsChange: [
    { action: permissions.render(permissions.settings.change), subject: null },
  ],
  settingsAdmin: [
    { action: permissions.render(permissions.settings.admin), subject: null },
  ],
};
