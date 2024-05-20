import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UID } from "@strapi/strapi";

import { fetchReactions } from "../injections/utils/api";
import { StrapiId } from "../../../types";

export type ContentManagerType = 'single-types' | 'collection-types';

type useContentManagerResult = {
  fetch: UseQueryResult<any, Error>;
};

const useContentManager = (uid: UID.ContentType, id: StrapiId): useContentManagerResult => {
  const fetch = useQuery({
    queryKey: ["get-reactions"],
    queryFn: () => fetchReactions(uid, id),
  });

  return { fetch };
};

export default useContentManager;
