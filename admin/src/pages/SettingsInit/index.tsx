import React from "react";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Settings from "../Settings";

const queryClient = new QueryClient();

const SettingsInit = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Settings />
    </QueryClientProvider>);
};

export default SettingsInit;
