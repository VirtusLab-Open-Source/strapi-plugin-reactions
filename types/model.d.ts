import type { Schema, Attribute } from '@strapi/strapi';
import { StrapiId } from './common';

export interface Reaction extends Schema.CollectionType {
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
    user: Attribute.Relation<
      'plugin::reactions.reaction',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    kind: Attribute.Relation<
      'plugin::reactions.reaction',
      'manyToOne',
      'plugin::reactions.reaction-type'
    > &
      Attribute.Required;
    related: Attribute.Relation<'plugin::reactions.reaction', 'morphToMany'> &
      Attribute.Required;
    relatedUid: Attribute.Text & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::reactions.reaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::reactions.reaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  }

  export type ReactionEntity = { id: StrapiId } & ReactionAttributes;
  
  export interface ReactionType extends Schema.CollectionType {
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
    name: Attribute.Text & Attribute.Required;
    slug: Attribute.UID & Attribute.Unique & Attribute.DefaultTo<false>;
    icon: Attribute.Media;
    emoji: Attribute.Text;
    emojiFallbackUrl: Attribute.Text;
    reactions: Attribute.Relation<
      'plugin::reactions.reaction-type',
      'oneToMany',
      'plugin::reactions.reaction'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::reactions.reaction-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::reactions.reaction-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  }

  export type ReactionTypeEntity = { id: StrapiId } & ReactionAttributes