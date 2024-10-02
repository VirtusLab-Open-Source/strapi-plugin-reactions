import { UID } from "@strapi/strapi";

import { getApiURL } from "../../utils";
import { StrapiId } from "../../../../@types";

type FetchConfig = {
  get: Function;
};

export const fetchReactions = async (uid: UID.ContentType, documentId?: StrapiId, config?: FetchConfig) => {
  if (config) {
    const { get } = config;

    try {
      const { data } = await get(getApiURL(`zone/count/${uid}${documentId ? `/${documentId}` : ''}`));

      return data;
    } catch (err) { }
  }
}
