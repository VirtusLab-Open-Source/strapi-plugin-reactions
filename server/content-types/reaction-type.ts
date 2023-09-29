/**
 * Comments Collection Type
 */

export default {
  collectionName: "vl_reactions_types",
  kind: "collectionType",
  info: {
    name: "Reaction Type",
    displayName: "Reaction Type",
    singularName: "reaction-type",
    pluralName: "reaction-types",
    description: "Type of Reaction"
  },
  options: {
    draftAndPublish: false,
    privateAttributes: [
      "createdAt",
      "updatedAt",
    ],
  },
  pluginOptions: {
    "content-manager": {
      visible: false,
    },
    "content-type-builder": {
      visible: false,
    },
  },
  attributes: {
    name: {
      type: "text",
      configurable: false,
      required: true,
    },
    slug: {
      type: "uid",
      unique: true,
      default: false,
      configurable: false,
    },
    icon: {
      type: "media",
      multiple: false,
      configurable: false,
    },
    emoji: {
      type: "text",
    },
    emojiFallbackUrl: {
      type: "text",
    },
    reactions: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'plugin::reactions.reaction',
      mappedBy: 'kind',
      configurable: false,
    },
  },
};
