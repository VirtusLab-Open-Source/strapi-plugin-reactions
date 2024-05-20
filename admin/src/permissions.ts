import { Id } from "strapi-typed";

const permissions = {
  render: (uid: Id) => `plugin::reactions.${uid}`,
  settings: {
    read: "settings.read",
    change: "settings.change",
    admin: "settings.admin",
  },
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
