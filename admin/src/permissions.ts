import permissions from "./../../permissions";

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
