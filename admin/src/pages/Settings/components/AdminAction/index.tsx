import React from "react";

import { Divider, Flex, Typography } from "@strapi/design-system";

import { AdminActionContainer, AdminActionDescription, AdminActionTrigger } from './styles';

type AdminActionProps = {
    children: any;// React.ReactNode | Array<React.ReactNode>;
    title: string;
    description: string;
    tip?: string;
};

export const AdminAction = ({ children, title, description, tip }: AdminActionProps) => {
    return (<Flex width="100%" direction="column" gap={2}>
        <AdminActionContainer>
            <AdminActionDescription>
                <Typography variant="epsilon" tag="h5">{title}</Typography>
                <Typography variant="omega">{description}</Typography>
                {tip && (<Typography variant="pi" textColor="neutral400">{tip}</Typography>)}
            </AdminActionDescription>
            <AdminActionTrigger>{children}</AdminActionTrigger>
        </AdminActionContainer>
        <Divider width="100%" />
    </Flex>);
}