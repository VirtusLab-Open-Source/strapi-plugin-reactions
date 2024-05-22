import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { UID } from "@strapi/strapi";
import { useFetchClient } from '@strapi/strapi/admin';

import { fetchReactions } from "../injections/utils/api";
import { StrapiId } from "../../../types";

export type ContentManagerType = 'singleType' | 'collectionType';

type useContentManagerResult = {
  fetch: UseQueryResult<any, Error>;
};

const useContentManager = (uid: UID.ContentType, id: StrapiId): useContentManagerResult => {
  const { get } = useFetchClient();

  const fetch = useQuery({
    queryKey: ["get-reactions"],
    queryFn: () => fetchReactions(uid, id, { get }),
  });

  return { fetch };
};

export default useContentManager;
