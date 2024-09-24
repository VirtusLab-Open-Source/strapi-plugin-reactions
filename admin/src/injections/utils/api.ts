import { UID } from "@strapi/strapi";

import { getApiURL } from "../../utils";
import { StrapiId } from "../../../../@types";

type FetchConfig = {
  get: Function;
};

export const fetchReactions = async (uid: UID.ContentType, id?: StrapiId, config?: FetchConfig) => {
  if (config) {
    const { get } = config;

    try {
      const { data } = await get(getApiURL(`zone/count/${uid}${id ? `/${id}` : ''}`));

      return data;
    } catch (err) { }
  }
}
