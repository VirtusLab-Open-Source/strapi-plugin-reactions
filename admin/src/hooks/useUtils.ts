import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import {
  generateSlug,
  syncAssociations,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";

export type useUtilsResult = {
  slugMutation: UseMutationResult<any, Error>;
  syncAssociationsMutation: any;//UseMutationResult<any, Error>;
};

const useUtils = (toggleNotification: any, client?: any): useUtilsResult => {
  const queryClient = useQueryClient(client);

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
      queryClient.invalidateQueries({ queryKey: ["generate-slug"] });
    }
    callback();
  };

  const slugMutation = useMutation({
    mutationFn: ({ payload }: any) => generateSlug(payload),
    onSuccess: () => handleSuccess(),
    onError: () => handleError('generate-slug'),
  });

  const syncAssociationsMutation = useMutation({
    mutationFn: () => syncAssociations(),
    onSuccess: () => handleSuccess('sync-associations'),
    onError: () => handleError('sync-associations'),
  });

  return { slugMutation, syncAssociationsMutation };
};

export default useUtils;
