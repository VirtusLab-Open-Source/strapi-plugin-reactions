import React from "react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { DesignSystemProvider } from "@strapi/design-system";
import { usePluginTheme } from "@sensinum/strapi-utils";


type InjectionInitializerProps = {
    children: React.ReactNode;
};

const queryClient = new QueryClient();

export const InjectionInitializer = ({ children }: InjectionInitializerProps) => {
    const { theme } = usePluginTheme();
    
    return (
        <QueryClientProvider client={queryClient}>
            <DesignSystemProvider theme={theme}>
                {children}
            </DesignSystemProvider>
        </QueryClientProvider>);


};