//@ts-nocheck

import { useMutation, useQueryClient } from "react-query";
import {
  generateSlug,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";

const useUtils = (toggleNotification) => {
  const queryClient = useQueryClient();

  const handleError = (callback = () => {}) => {
    toggleNotification({
      type: "warning",
      message: `${pluginId}.page.settings.notification.generate-slug.error`,
    });
    callback();
  };

  const handleSuccess = (
    callback = () => {},
    invalidateQueries = true,
  ) => {
    if (invalidateQueries) {
      queryClient.invalidateQueries("generate-slug");
    }
    callback();
  };

  const slugMutation = useMutation(generateSlug, {
    onSuccess: () => handleSuccess(),
    onError: () => handleError(),
  });

  return { slugMutation };
};

export default useUtils;
