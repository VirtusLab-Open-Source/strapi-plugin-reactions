import React from "react";

import { Divider, Typography } from "@strapi/design-system";

import { AdminActionContainer, AdminActionDescription, AdminActionTrigger } from './styles';

type AdminActionProps = {
    children: any;// React.ReactNode | Array<React.ReactNode>;
    title: string;
    description: string;
    tip?: string;
};

export const AdminAction = ({ children, title, description, tip }: AdminActionProps) => {
    return (<><AdminActionContainer>
        <AdminActionDescription>
            <Typography variant="epsilon" as="h5">{ title }</Typography>
            <Typography variant="omega">{ description }</Typography>
            { tip && (<Typography variant="pi" textColor="neutral400">{ tip }</Typography>) }
        </AdminActionDescription>
        <AdminActionTrigger>{ children }</AdminActionTrigger>
    </AdminActionContainer>
    <Divider unsetMargin={false} />
    </>);
}