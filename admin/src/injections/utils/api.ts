import { Data, UID } from "@strapi/strapi";
import qs from "qs";

import { getApiURL } from "../../utils";

type FetchConfig = {
  get: Function;
};

export const fetchReactions = async (uid: UID.ContentType, documentId?: Data.DocumentID, locale?: string, config?: FetchConfig) => {
  if (config) {
    const { get } = config;
    const queryParams = qs.stringify({
      locale,
    });

    try {
      const { data } = await get(getApiURL(`zone/count/${uid}${documentId ? `/${documentId}` : ''}${queryParams ? `?${queryParams}` : ''}`));

      return data;
    } catch (err) { }
  }
}
