import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import {
  fetchConfig,
  updateConfig,
  deleteReactionType,
} from "../pages/Settings/utils/api";
import { pluginId } from "../pluginId";

export type useConfigResult = {
  fetch: UseQueryResult<any, Error>;
  submitMutation: UseMutationResult<any, Error>;
  deleteMutation: UseMutationResult<any, Error>;
};

const useConfig = (toggleNotification: any, client?: any): useConfigResult => {
  const queryClient = useQueryClient(client);

  const fetch = useQuery({
    queryKey: ["get-config"], 
    queryFn: () => fetchConfig(toggleNotification)
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
    mutationFn: ({ body, toggleNotification }: any) => updateConfig(body, toggleNotification),
    onSuccess: () => handleSuccess("submit"),
    onError: () => handleError("submit"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, toggleNotification }: any) => deleteReactionType(id, toggleNotification),
    onSuccess: () => handleSuccess("reaction.delete"),
    onError: () => handleError("reaction.delete"),
  });


  return { fetch, submitMutation, deleteMutation };
};

export default useConfig;
