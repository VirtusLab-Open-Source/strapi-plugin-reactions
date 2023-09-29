// TODO
//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchConfig,
  updateConfig,
  deleteReactionType,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";

const useConfig = (toggleNotification) => {
  const queryClient = useQueryClient();

  const fetch = useQuery("get-config", () => fetchConfig(toggleNotification));

  const handleError = (type, callback = () => {}) => {
    toggleNotification({
      type: "warning",
      message: `${pluginId}.page.settings.notification.${type}.error`,
    });
    callback();
  };

  const handleSuccess = (
    type,
    callback = () => {},
    invalidateQueries = true,
  ) => {
    if (invalidateQueries) {
      queryClient.invalidateQueries("get-config");
    }
    toggleNotification({
      type: "success",
      message: `${pluginId}.page.settings.notification.${type}.success`,
    });
    callback();
  };

  const submitMutation = useMutation(updateConfig, {
    onSuccess: () => handleSuccess("submit"),
    onError: () => handleError("submit"),
  });

  const deleteMutation = useMutation(deleteReactionType, {
    onSuccess: () => handleSuccess("reaction.delete"),
    onError: () => handleError("reaction.delete"),
  });


  return { fetch, submitMutation, deleteMutation };
};

export default useConfig;
