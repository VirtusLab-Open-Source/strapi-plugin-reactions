import { getApiURL, axiosInstance, handleAPIError } from "../../utils";

// eslint-disable-next-line import/prefer-default-export
export const fetchReactions = async (uid, id, toggleNotification) => {
  try {
    const { data } = await axiosInstance.get(getApiURL(`zone/count/${uid}/${id}`));

    return data;
  } catch (err) {
    handleAPIError(
      err,
      toggleNotification,
      "page.injection.notification.fetch.error",
    );
  }
};
