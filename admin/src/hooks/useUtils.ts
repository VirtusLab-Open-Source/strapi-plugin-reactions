//@ts-nocheck

import { useMutation, useQueryClient } from "react-query";
import {
  generateSlug,
  syncAssociations,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";

const useUtils = (toggleNotification) => {
  const queryClient = useQueryClient();

  const handleError = (type: string, callback = () => {}) => {
    toggleNotification({
      type: "warning",
      message: `${pluginId}.page.settings.notification.${type}.error`,
    });
    callback();
  };

  const handleSuccess = (
    type?: string,
    callback = () => {},
    invalidateQueries = true,
  ) => {
    if (type) {
      toggleNotification({
        type: "success",
        message: `${pluginId}.page.settings.notification.${type}.success`,
      });
    }
    if (invalidateQueries) {
      queryClient.invalidateQueries("generate-slug");
    }
    callback();
  };

  const slugMutation = useMutation(generateSlug, {
    onSuccess: () => handleSuccess(),
    onError: () => handleError('generate-slug'),
  });

  const syncAssociationsMutation = useMutation(syncAssociations, {
    onSuccess: () => handleSuccess('sync-associations'),
    onError: () => handleError('sync-associations'),
  });

  return { slugMutation, syncAssociationsMutation };
};

export default useUtils;
