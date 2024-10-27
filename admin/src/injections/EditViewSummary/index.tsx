import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, get } from "lodash";
import qs from "qs";

import { Data, UID } from "@strapi/strapi";
import {
    useNotification
} from "@strapi/strapi/admin";

import { 
    Box,
    Grid, 
    Typography } from '@strapi/design-system';

import { ReactionCounter, ReactionCounterProps } from "./components/ReactionCounter";

import useContentManager, { ContentManagerType } from "../../hooks/useContentManager";
import useConfig from "../../hooks/useConfig";

const CONTENT_MANAGER_PATH_PATTERN = /.*\/(?<type>[a-zA-Z-]+)\/(?<uid>[a-z0-9-_]+::[a-z0-9-_]+\.[a-z0-9-_]+)\/?(?<documentId>.{24})?/;
const CONTENT_MANAGER_TYPES: { [key: string]: ContentManagerType } = {
    SINGLE_TYPE: 'single-types',
    COLLECTION_TYPE: 'collection-types',
};

type ContentManagerPathProps = {
    type: ContentManagerType;
    uid: UID.ContentType;
    documentId: Data.DocumentID;
};

type ContentManagerQueryParams = {
    plugins: {
        i18n: {
            locale: string;
        };
    };
};

export const EditViewSummary = () => {
    const location = useLocation();
    const toggleNotification = useNotification();

    const groups: ContentManagerPathProps = new RegExp(CONTENT_MANAGER_PATH_PATTERN, "gm")
        .exec(location.pathname)?.groups as ContentManagerPathProps;

    const { uid, documentId, type } = groups ?? {};
    const queryParams = qs.parse(location.search?.replace("?", "") ?? "") as ContentManagerQueryParams;

    if (!documentId && (type === CONTENT_MANAGER_TYPES.COLLECTION_TYPE)) {
        return null;
    }

    const locale = queryParams?.plugins?.i18n?.locale;

    const { fetch: fetchConfig } = useConfig(toggleNotification);
    const { fetch: fetchReactions } = useContentManager(uid, documentId, locale);

    const { types = [] } = fetchConfig?.data || {} as any;

    const isLoading = fetchConfig.isPending || fetchReactions.isPending
    const isNotInjectable = isLoading
        || isEmpty(fetchReactions.data)
        || (!types || isEmpty(types));

    useEffect(() => {
        fetchReactions.refetch();
    }, [locale]);

    if (isNotInjectable) {
        return null;
    }

    const { data: reactionsCount } = fetchReactions;

    return (<Box width="100%" paddingTop={2}>
        <Typography variant="sigma" textColor="neutral600">Reactions</Typography>
        <Box paddingTop={2}>
            <Grid.Root gap={4}>
                {types.map(({ name, slug, icon, emoji }: ReactionCounterProps & { slug: string }) => (
                    <Grid.Item key={`reaction-type-${slug}`} col={4} s={6} xs={12}>
                        <ReactionCounter name={name} icon={icon} emoji={emoji} count={get(reactionsCount, slug)} />
                    </Grid.Item>
                ))}
            </Grid.Root>
        </Box>
    </Box>);


};