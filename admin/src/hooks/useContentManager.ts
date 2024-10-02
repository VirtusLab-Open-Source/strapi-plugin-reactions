import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { UID } from "@strapi/strapi";
import { useFetchClient } from '@strapi/strapi/admin';

import { fetchReactions } from "../injections/utils/api";
import { StrapiId } from "../../../@types";

export type ContentManagerType = 'single-types' | 'collection-types';

type useContentManagerResult = {
  fetch: UseQueryResult<any, Error>;
};

const useContentManager = (uid: UID.ContentType, documentId: StrapiId): useContentManagerResult => {
  const { get } = useFetchClient();

  const fetch = useQuery({
    queryKey: ["get-reactions"],
    queryFn: () => fetchReactions(uid, documentId, { get }),
  });

  return { fetch };
};

export default useContentManager;
