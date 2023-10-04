import { UID } from "@strapi/strapi";

import { getApiURL, axiosInstance } from "../../utils";
import { StrapiId } from "../../../../types";

// eslint-disable-next-line import/prefer-default-export
export const fetchReactions = async (uid: UID.ContentType, id: StrapiId) => {
  try {
    const { data } = await axiosInstance.get(getApiURL(`zone/count/${uid}/${id}`));

    return data;
  } catch (err) { }
}
