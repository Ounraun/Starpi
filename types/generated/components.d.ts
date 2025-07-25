import type { Schema, Struct } from '@strapi/strapi';

export interface ContentContentCard extends Struct.ComponentSchema {
  collectionName: 'components_content_content_cards';
  info: {
    displayName: 'Content Card';
  };
  attributes: {
    content: Schema.Attribute.Text;
    subTitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ParicipantEmail extends Struct.ComponentSchema {
  collectionName: 'components_paricipant_emails';
  info: {
    displayName: 'Email';
  };
  attributes: {
    email: Schema.Attribute.Email;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.content-card': ContentContentCard;
      'paricipant.email': ParicipantEmail;
    }
  }
}
