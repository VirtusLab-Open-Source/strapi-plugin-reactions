import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { Data, UID } from "@strapi/strapi";
import { useFetchClient } from '@strapi/strapi/admin';

import { fetchReactions } from "../injections/utils/api";

export type ContentManagerType = 'single-types' | 'collection-types';

type useContentManagerResult = {
  fetch: UseQueryResult<any, Error>;
};

const useContentManager = (uid: UID.ContentType, documentId: Data.DocumentID, locale?: string): useContentManagerResult => {
  const { get } = useFetchClient();

  const fetch = useQuery({
    queryKey: ["get-reactions"],
    queryFn: () => fetchReactions(uid, documentId, locale, { get }),
  });

  return { fetch };
};

export default useContentManager;
