import { useQuery } from "react-query";
import { UID } from "@strapi/strapi";

import { fetchReactions } from "../injections/utils/api";
import { StrapiId } from "../../../types";

const useContentManager = (uid: UID.ContentType, id: StrapiId) => {
  const fetch = useQuery("get-reactions", () => fetchReactions(uid, id));

  return { fetch };
};

export default useContentManager;
