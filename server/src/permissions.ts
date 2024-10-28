export default {
  render: (uid: string) => `plugin::reactions.${uid}`,
  settings: {
    read: "settings.read",
    change: "settings.change",
    admin: "settings.admin",
  },
};
