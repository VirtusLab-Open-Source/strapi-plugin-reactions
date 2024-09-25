import React from "react";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Settings from "../Settings";
import { DesignSystemProvider } from "@strapi/design-system";
import { usePluginTheme } from "@virtuslab/strapi-utils";

const queryClient = new QueryClient();

const SettingsInit = () => {
  const { theme } = usePluginTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <DesignSystemProvider theme={theme}>
        <Settings />
      </DesignSystemProvider>
    </QueryClientProvider>);
};

export default SettingsInit;
