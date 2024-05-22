import { isNil } from "lodash";
import { getApiURL, handleAPIError } from "../../../utils";
import qs from "qs";
import { StrapiId, ToBeFixed } from "../../../../../types";

export type FetchConfig = {
  toggleNotification: ToBeFixed;
  fetchClient: {
    get: Function;
    post: Function;
    put: Function;
    del: Function;
  };
};

export const fetchConfig = async ({ toggleNotification, fetchClient }: FetchConfig) => {

  try {
    const { data } = await fetchClient.get(getApiURL(`settings/config`));

    return data;
  } catch (err) {
    handleAPIError(
      err,
      toggleNotification,
      "page.settings.notification.fetch.error",
    );
  }
};

export const updateConfig = async (body: ToBeFixed, { toggleNotification, fetchClient }: FetchConfig) => {
  try {
    const method = isNil(body.id) ? fetchClient.post : fetchClient.put;
    const { data } = await method(
      getApiURL(`settings/config`),
      body,
    );

    return data;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const deleteReactionType = async (id: StrapiId, { toggleNotification, fetchClient }: FetchConfig) => {
  try {
    const { data } = await fetchClient.del(
      getApiURL(`settings/config/reaction-type/${id}`)
    );

    return data.result;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const generateSlug = async (payload: ToBeFixed, { fetchClient }: FetchConfig) => {
  try {
    const queryParams = qs.stringify(payload);
    const { data } = await fetchClient.get(getApiURL(`utils/slug?${queryParams}`));

    return data.slug;
  } catch (err) {
    throw err;
  }
};

export const syncAssociations = async ({ fetchClient }: FetchConfig) => {
  try {
    const { data } = await fetchClient.post(getApiURL(`utils/sync-associations`));

    return data;
  } catch (err) {
    throw err;
  }
};
