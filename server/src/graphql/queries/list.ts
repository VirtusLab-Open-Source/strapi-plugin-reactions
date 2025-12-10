import { Data, UID } from "@strapi/strapi";
import { Context } from "koa";

import {
  IServiceClient,
  StrapiGraphQLContext,
} from "../../../../@types";
import { getPluginService } from "../../utils/functions";

type ListAllResolverProps = {
  kind: string;
  uid: UID.ContentType;
  locale?: string;
  documentId?: Data.DocumentID;
};

export default ({ nexus }: StrapiGraphQLContext) => {
  const { nonNull, stringArg, list } = nexus;

  return {
    type: list("Reaction"),
    args: {
      kind: stringArg(),
      uid: nonNull(stringArg()),
      documentId: stringArg(),
      locale: stringArg(),
    },
    async resolve(
      _: Object, 
      args: ListAllResolverProps,
      ctx: Context) {
      const { kind, uid, documentId, locale } = args;
      const { state: { user = undefined } = {}, koaContext } = ctx;
      const authorId = koaContext.get('x-reactions-author');

      return await getPluginService<IServiceClient>("client").list(kind, uid, user, documentId, locale, authorId);
    },
  };
};
