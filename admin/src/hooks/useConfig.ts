import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { useIntl } from "react-intl";
import { useFetchClient } from '@strapi/strapi/admin';

import {
  fetchConfig,
  createReactionType,
  updateReactionType,
  updateConfig,
  deleteReactionType,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";
import { CTReactionType } from '../../../@types';

type SubmitPayload = {
  body: CTReactionType;
  toggleNotification: any;
};

type UpdateConfigPayload = {
  blockedAuthorProps: string[];
  toggleNotification: any;
};

export type useConfigResult = {
  fetch: UseQueryResult<any, Error>;
  submitMutation: UseMutationResult<any, Error, SubmitPayload>;
  updateConfigMutation: UseMutationResult<any, Error, UpdateConfigPayload>;
  deleteMutation: UseMutationResult<any, Error>;
};

const useConfig = (toggleNotification: any, client?: any): useConfigResult => {
  const queryClient = useQueryClient(client);
  const fetchClient = useFetchClient();
  const { formatMessage } = useIntl();
  const config = { toggleNotification, fetchClient };

  const fetch = useQuery({
    queryKey: ["get-config"], 
    queryFn: () => fetchConfig(config),
  });

  const handleError = (type: any, callback = () => {}) => {
    toggleNotification({
      type: "warning",
      message: formatMessage({
        id: `${pluginId}.page.settings.notification.${type}.error`,
      }),
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
      message: formatMessage({
        id: `${pluginId}.page.settings.notification.${type}.success`,
      }),
    });
    callback();
  };

  const submitMutation = useMutation({
    mutationFn: ({ body }: SubmitPayload) =>
      body.documentId
        ? updateReactionType(body, config)
        : createReactionType(body, config),
    onSuccess: () => handleSuccess("submit"),
    onError: () => handleError("submit"),
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ blockedAuthorProps }: UpdateConfigPayload) => updateConfig({ blockedAuthorProps }, config),
    onSuccess: () => handleSuccess("pluginConfig"),
    onError: () => handleError("pluginConfig"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ documentId }: any) => deleteReactionType(documentId, config),
    onSuccess: () => handleSuccess("reaction.delete"),
    onError: () => handleError("reaction.delete"),
  });


  return { fetch, submitMutation, updateConfigMutation, deleteMutation };
};

export default useConfig;
