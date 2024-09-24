import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';

import { useFetchClient } from '@strapi/strapi/admin';

import {
  fetchConfig,
  updateConfig,
  deleteReactionType,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";
import { ReactionTypeEntity } from '../../../@types';

type SubmitPayload = {
  body: ReactionTypeEntity;
  toggleNotification: any;
};

export type useConfigResult = {
  fetch: UseQueryResult<any, Error>;
  submitMutation: UseMutationResult<any, Error, SubmitPayload>;
  deleteMutation: UseMutationResult<any, Error>;
};

const useConfig = (toggleNotification: any, client?: any): useConfigResult => {
  const queryClient = useQueryClient(client);
  const fetchClient = useFetchClient();
  const config = { toggleNotification, fetchClient };

  const fetch = useQuery({
    queryKey: ["get-config"], 
    queryFn: () => fetchConfig(config),
  });

  const handleError = (type: any, callback = () => {}) => {
    toggleNotification({
      type: "warning",
      message: `${pluginId}.page.settings.notification.${type}.error`,
    });
    callback();
  };

  const handleSuccess = (
    type: any,
    callback = () => {},
    invalidateQueries = true,
  ) => {
    if (invalidateQueries) {
      queryClient.invalidateQueries({ queryKey: ["get-config"] });
    }
    toggleNotification({
      type: "success",
      message: `${pluginId}.page.settings.notification.${type}.success`,
    });
    callback();
  };

  const submitMutation = useMutation({
    mutationFn: ({ body }: SubmitPayload) => updateConfig(body, config),
    onSuccess: () => handleSuccess("submit"),
    onError: () => handleError("submit"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: any) => deleteReactionType(id, config),
    onSuccess: () => handleSuccess("reaction.delete"),
    onError: () => handleError("reaction.delete"),
  });


  return { fetch, submitMutation, deleteMutation };
};

export default useConfig;
