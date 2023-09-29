/**
 * Reactions Collection Type
 */

export default {
  collectionName: "vl_reactions",
  kind: "collectionType",
  info: {
    name: "Reaction",
    displayName: "Reactions",
    singularName: "reaction",
    pluralName: "reactions",
    description: "Reactions per Content Type"
  },
  options: {
    draftAndPublish: false,
    privateAttributes: [
      "relatedUid",
    ],
  },
  pluginOptions: {
    "content-manager": {
      visible: false,
    },
    "content-type-builder": {
      visible: true,
    },
  },
  attributes: {
    user: {
      type: "relation",
      relation: "oneToOne",
      target: "plugin::users-permissions.user",
      configurable: false,
    },
    kind: {
      type: 'relation',
      relation: "manyToOne",
      target: "plugin::reactions.reaction-type",
      inversedBy: "reactions",
      // collectionName: "vl_reactions_types",
      required: true,
      configurable: false,
    },
    related: {
      type: 'relation',
      relation: 'morphToMany',
      required: true,
      configurable: false,
    },
    relatedUid: {
      type: 'text',
      required: true,
      configurable: false,
    }
  },
};
