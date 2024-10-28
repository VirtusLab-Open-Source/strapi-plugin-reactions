import type { Struct, Schema, Data } from '@strapi/strapi';

export interface Reaction extends Struct.CollectionTypeSchema {
  collectionName: 'vl_reactions';
  info: {
    name: 'Reaction';
    displayName: 'Reactions';
    singularName: 'reaction';
    pluralName: 'reactions';
    description: 'Reactions per Content Type';
  };
  options: {
    draftAndPublish: false;
    privateAttributes: ['relatedUid'];
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: true;
    };
  };
  attributes: ReactionAttributes;
}

export type ReactionAttributes = {
  user: Schema.Attribute.Relation<
    'oneToOne',
    'plugin::users-permissions.user'
  >;
  kind: Schema.Attribute.Relation<
    'manyToOne',
    'plugin::reactions.reaction-type'
  > &
  Schema.Attribute.Required;
  related: Schema.Attribute.Relation<'morphToMany'> &
  Schema.Attribute.Required;
  relatedUid: Schema.Attribute.Text & Schema.Attribute.Required;
  createdAt: Schema.Attribute.DateTime;
  updatedAt: Schema.Attribute.DateTime;
  publishedAt: Schema.Attribute.DateTime;
  createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
  Schema.Attribute.Private;
  updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
  Schema.Attribute.Private;
  locale: Schema.Attribute.String;
}

export type ReactionEntity = { 
  id: Data.ID;
  documentId: Data.DocumentID;
  locale?: string;
} & ReactionAttributes;

export interface ReactionType extends Struct.CollectionTypeSchema {
  collectionName: 'vl_reactions_types';
  info: {
    name: 'Reaction Type';
    displayName: 'Reaction Type';
    singularName: 'reaction-type';
    pluralName: 'reaction-types';
    description: 'Type of Reaction';
  };
  options: {
    draftAndPublish: false;
    privateAttributes: ['createdAt', 'updatedAt'];
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: ReactionTypeAttributes;
}

export type ReactionTypeAttributes = {
  name: Schema.Attribute.Text & Schema.Attribute.Required;
  slug: Schema.Attribute.UID &
  Schema.Attribute.Unique &
  Schema.Attribute.DefaultTo<false>;
  icon: Schema.Attribute.Media;
  emoji: Schema.Attribute.Text;
  emojiFallbackUrl: Schema.Attribute.Text;
  reactions: Schema.Attribute.Relation<
    'oneToMany',
    'plugin::reactions.reaction'
  >;
  createdAt: Schema.Attribute.DateTime;
  updatedAt: Schema.Attribute.DateTime;
  publishedAt: Schema.Attribute.DateTime;
  createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
  Schema.Attribute.Private;
  updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
  Schema.Attribute.Private;
  locale: Schema.Attribute.String;
}

export type CTReactionType = Data.ContentType["plugin::reactions.reaction-type"];
export type CTReaction = Data.ContentType["plugin::reactions.reaction"];