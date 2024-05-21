import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';

import {
  generateSlug,
  syncAssociations,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";
import { StrapiId } from '../../../types';

type SlugMutationPayload = {
  value: string;
  id: StrapiId;
};

export type useUtilsResult = {
  slugMutation: UseMutationResult<string, Error, SlugMutationPayload>;
  syncAssociationsMutation: UseMutationResult<any, Error, void>;
};

const useUtils = (toggleNotification: any): useUtilsResult => {
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
      queryClient.invalidateQueries({ queryKey: ["generate-slug"] });
    }
    callback();
  };

  const slugMutation = useMutation({
    mutationFn: ({ value, id }: SlugMutationPayload) => generateSlug({ value, id}),
    onSuccess: () => handleSuccess(),
    onError: () => handleError('generate-slug'),
  });

  const syncAssociationsMutation = useMutation({
    mutationFn: syncAssociations,
    onSuccess: () => handleSuccess('sync-associations'),
    onError: () => handleError('sync-associations'),
  });

  return { slugMutation, syncAssociationsMutation };
};

export default useUtils;
