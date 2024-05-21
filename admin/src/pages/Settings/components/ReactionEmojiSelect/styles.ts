import styled from "styled-components";

import { Flex, Popover, Typography } from "@strapi/design-system";

const sizing = {
    width: '100%',
    height: '162px',
    innerHeight: '124px',
};

export const ReactionEmojiSelectContainer = styled.div`
    display: block;
`;

export const ReactionEmojiSelectInner = styled(Flex)`
    width: ${sizing.width};
    height: ${sizing.innerHeight};
`;

export const ReactionEmojiSelectDisplay = styled(Flex)`
    font-size: 300%;
`;

export const ReactionEmojiSelectTypography = styled(Typography)`
    align-items: center;
`;

export const ReactionEmojiSelectPopover = styled(Popover)`
    max-height: 100%;
    padding: 0;

    border: 0;

    overflow: visible;

    aside {
        background: none;

        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none;

        .epr-search {
            background: none !important;
        }

        .epr-emoji-category-label {
            background: none !important;
        }
    }
`;