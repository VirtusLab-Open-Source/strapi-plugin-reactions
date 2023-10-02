import { useQuery } from "react-query";
import { UID } from "@strapi/strapi";

import { fetchReactions } from "../injections/utils/api";
import { StrapiId } from "../../../types";

const useContentManager = (uid: UID.ContentType, id: StrapiId, toggleNotification) => {
  const fetch = useQuery("get-reactions", () => fetchReactions(uid, id, toggleNotification));

  return { fetch };
};

export default useContentManager;
