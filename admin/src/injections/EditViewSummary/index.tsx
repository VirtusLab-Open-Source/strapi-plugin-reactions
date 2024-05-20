import React from "react";
import { useLocation } from 'react-router-dom';
import { isEmpty, get } from "lodash";

import { UID } from "@strapi/strapi";
import {
    useNotification
} from "@strapi/admin/strapi-admin";

import { 
    Box,
    Divider, 
    Grid, 
    GridItem, 
    Typography } from '@strapi/design-system';

import { ReactionCounter, ReactionCounterProps } from "./components/ReactionCounter";

import useContentManager, { ContentManagerType } from "../../hooks/useContentManager";
import useConfig from "../../hooks/useConfig";

const CONTENT_MANAGER_PATH_PATTERN = /.*\/(?<type>[a-zA-Z-]+)\/(?<uid>[a-z0-9-_]+::[a-z0-9-_]+\.[a-z0-9-_]+)\/?(?<id>\d*)/;
const CONTENT_MANAGER_TYPES: { [key: string]: ContentManagerType } = {
    SINGLE_TYPE: 'single-types',
    COLLECTION_TYPE: 'collection-types',
};

type ContentManagerPathProps = {
    type: ContentManagerType;
    uid: UID.ContentType;
    id?: string | number;
};

export const EditViewSummary = () => {
    const location = useLocation();
    const toggleNotification = useNotification();

    const groups: ContentManagerPathProps = new RegExp(CONTENT_MANAGER_PATH_PATTERN, "gm")
        .exec(location.pathname)?.groups as ContentManagerPathProps;

    const { uid, id, type } = groups;

    if (!id && (type === CONTENT_MANAGER_TYPES.COLLECTION_TYPE)) {
        return null;
    }

    const { fetch: fetchConfig } = useConfig(toggleNotification);
    const { fetch: fetchReactions } = useContentManager(uid, id);

    const { types = [] } = fetchConfig?.data || {} as any;

    const isLoading = fetchConfig.isPending || fetchReactions.isPending
    const isNotInjectable = isLoading
        || isEmpty(fetchReactions.data)
        || (!types || isEmpty(types));

    if (isNotInjectable) {
        return null;
    }

    const { data: reactionsCount } = fetchReactions;

    return (<Box paddingTop={4}>
        <Typography variant="sigma" textColor="neutral600">Reactions</Typography>
        <Divider unsetMargin={false} />
        <Box paddingTop={2}>
            <Grid gap={4}>
                {types.map(({ name, slug, icon, emoji }: ReactionCounterProps & { slug: string }) => (
                    <GridItem key={`reaction-type-${slug}`} col={4} s={6} xs={12}>
                        <ReactionCounter name={name} icon={icon} emoji={emoji} count={get(reactionsCount, slug)} />
                    </GridItem>
                ))}
            </Grid>
        </Box>
    </Box>);


};