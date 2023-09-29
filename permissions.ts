import { Id } from "strapi-typed";

export default {
  render: (uid: Id) => `plugin::reactions.${uid}`,
  settings: {
    read: "settings.read",
    change: "settings.change",
  },
};
