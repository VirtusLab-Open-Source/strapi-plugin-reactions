import React, { useEffect, useState } from "react";

import { Tooltip } from '@strapi/design-system';

import { ReactionCounterContainer, ReactionCounterDot, ReactionEmoji, ReactionImage, ReactionName } from "./styled";

export type ReactionCounterProps = {
    name: string;
    icon?: any;
    emoji?: string;
    count: number;
};

export const ReactionCounter = ({ name, icon, emoji, count = 0 }: ReactionCounterProps) => {
    const [theme, setTheme] = useState();

    useEffect(() => {
        setTheme(window.localStorage?.STRAPI_THEME);
    }, []);

    return (<ReactionCounterContainer active>
        {icon && (<ReactionImage src={icon?.url} />)}
        {!icon && (<ReactionEmoji>{emoji}</ReactionEmoji>)}
        <ReactionName>
            <Tooltip description={name}>
                <span>{name}</span>
            </Tooltip>
        </ReactionName>
        <ReactionCounterDot theme={theme}>{count}</ReactionCounterDot>
    </ReactionCounterContainer>);


};