import { isNil } from "lodash";
import { getApiURL, axiosInstance, handleAPIError } from "../../../utils";
import qs from "qs";
import { StrapiId, ToBeFixed } from "../../../../../types";

// eslint-disable-next-line import/prefer-default-export
export const fetchConfig = async (toggleNotification: ToBeFixed) => {
  try {
    const { data } = await axiosInstance.get(getApiURL(`settings/config`));

    return data;
  } catch (err) {
    handleAPIError(
      err,
      toggleNotification,
      "page.settings.notification.fetch.error",
    );
  }
};

export const updateConfig = async (body: ToBeFixed, toggleNotification: ToBeFixed) => {
  try {
    const method = isNil(body.id) ? axiosInstance.post : axiosInstance.put;
    const { data } = await method(
      getApiURL(`settings/config`),
      body,
    );

    return data;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const deleteReactionType = async (id: StrapiId, toggleNotification: ToBeFixed) => {
  try {
    const { data } = await axiosInstance.delete(
      getApiURL(`settings/config/reaction-type/${id}`)
    );

    return data;
  } catch (err) {
    handleAPIError(err, toggleNotification);
  }
};

export const generateSlug = async (payload: ToBeFixed) => {
  try {
    const queryParams = qs.stringify(payload);
    const { data } = await axiosInstance.get(getApiURL(`utils/slug?${queryParams}`));

    return data;
  } catch (err) {
    throw err;
  }
};

export const syncAssociations = async () => {
  try {
    const { data } = await axiosInstance.post(getApiURL(`utils/sync-associations`));

    return data;
  } catch (err) {
    throw err;
  }
};
