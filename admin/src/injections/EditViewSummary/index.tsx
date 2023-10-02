import React from "react";
import { useLocation } from 'react-router-dom';
import { isEmpty } from "lodash";

import { UID } from "@strapi/strapi";
import {
    useNotification
} from "@strapi/helper-plugin";

import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';
import useContentManager from "../../hooks/useContentManager";
import useConfig from "../../hooks/useConfig";
import { ReactionCounter } from "./components/ReactionCounter";

const CONTENT_MANAGER_PATH_PATTERN = /.*\/(?<uid>[a-z0-9-_]+::[a-z0-9-_]+\.[a-z0-9-_]+)\/(?<id>\d*)/;

type ContentManagerPathProps = {
    uid: UID.ContentType;
    id: string | number;
};

export const EditViewSummary = () => {
    const location = useLocation();
    const toggleNotification = useNotification();

    const groups: ContentManagerPathProps = new RegExp(CONTENT_MANAGER_PATH_PATTERN, "gm")
        .exec(location.pathname)?.groups as ContentManagerPathProps;
    const { uid, id } = groups;

    const { fetch: fetchConfig } = useConfig(toggleNotification);
    const { fetch: fetchReactions } = useContentManager(uid, id, toggleNotification);

    const { types = [] } = fetchConfig?.data || {};

    const isLoading = fetchConfig.isLoading || fetchReactions.isLoading
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
        <Box paddingTop={4}>
            <Grid gap={4}>
                {types.map(({ name, slug, icon, emoji }) => (
                    <GridItem key={`reaction-type-${slug}`} col={3} s={4} xs={12}>
                        <ReactionCounter name={name} icon={icon} emoji={emoji} count={reactionsCount[slug]} />
                    </GridItem>
                ))}
            </Grid>
        </Box>
    </Box>);


};