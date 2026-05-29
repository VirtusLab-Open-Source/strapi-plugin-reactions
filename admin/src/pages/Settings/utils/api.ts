import { Data } from "@strapi/strapi";
import { getApiURL, handleAPIError } from "../../../utils";
import qs from "qs";
import { ReactionsPluginConfig, CTReactionType, ToBeFixed } from "../../../../../@types";

export type FetchConfig = {
  toggleNotification: ToBeFixed;
  fetchClient: {
    get: Function;
    post: Function;
    put: Function;
    del: Function;
  };
};

export const fetchConfig = async ({ toggleNotification, fetchClient }: FetchConfig): Promise<ReactionsPluginConfig | undefined> => {

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

export const createReactionType = async (
  body: CTReactionType,
  { toggleNotification, fetchClient }: FetchConfig,
): Promise<ReactionsPluginConfig | undefined> => {
  try {
    const { data } = await fetchClient.post(
      getApiURL(`settings/config/reaction-type`),
      body,
    );

    return data;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const updateReactionType = async (
  body: CTReactionType,
  { toggleNotification, fetchClient }: FetchConfig,
): Promise<ReactionsPluginConfig | undefined> => {
  try {
    const { data } = await fetchClient.put(
      getApiURL(`settings/config/reaction-type`),
      body,
    );

    return data;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const deleteReactionType = async (documentId: Data.DocumentID, { toggleNotification, fetchClient }: FetchConfig): Promise<number | undefined> => {
  try {
    const { data } = await fetchClient.del(
      getApiURL(`settings/config/reaction-type/${documentId}`)
    );

    return data.result;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const generateSlug = async (payload: ToBeFixed, { fetchClient }: FetchConfig): Promise<string | undefined> => {
  try {
    const queryParams = qs.stringify(payload);
    const { data } = await fetchClient.get(getApiURL(`utils/slug?${queryParams}`));

    return data.slug;
  } catch (err) {
    throw err;
  }
};

export const syncAssociations = async ({ fetchClient }: FetchConfig): Promise<void> => {
  try {
    const { data } = await fetchClient.post(getApiURL(`utils/syncAssociations`));

    return data;
  } catch (err) {
    throw err;
  }
};
