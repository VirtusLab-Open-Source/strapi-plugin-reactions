import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { useFetchClient } from '@strapi/strapi/admin';

import {
  generateSlug,
  syncAssociations,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";
import { StrapiId } from '../../../@types';

type SlugMutationPayload = {
  value: string;
  documentId: StrapiId;
};

export type useUtilsResult = {
  slugMutation: UseMutationResult<string | undefined, Error, SlugMutationPayload>;
  syncAssociationsMutation: UseMutationResult<any, Error, void>;
};

const useUtils = (toggleNotification: any): useUtilsResult => {
  const queryClient = useQueryClient();
  const fetchClient = useFetchClient();
  const config = { toggleNotification, fetchClient };

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
      queryClient.invalidateQueries({ queryKey: ["generateSlug"] });
    }
    callback();
  };

  const slugMutation = useMutation({
    mutationFn: ({ value, documentId }: SlugMutationPayload) => generateSlug({ value, documentId}, config),
    onSuccess: () => handleSuccess(),
    onError: () => handleError('generateSlug'),
  });

  const syncAssociationsMutation = useMutation({
    mutationFn: () => syncAssociations(config),
    onSuccess: () => handleSuccess('syncAssociations'),
    onError: () => handleError('syncAssociations'),
  });

  return { slugMutation, syncAssociationsMutation };
};

export default useUtils;
