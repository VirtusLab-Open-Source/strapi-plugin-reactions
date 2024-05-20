import styled from "styled-components";

import { Popover, Typography } from "@strapi/design-system";

const sizing = {
    width: '100%',
    height: '162px',
    innerHeight: '124px',
};

export const ReactionEmojiSelectContainer = styled.div`
    display: block;
`;

export const ReactionEmojiSelectInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: ${sizing.width};
    height: ${sizing.innerHeight};
`;

export const ReactionEmojiSelectDisplay = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    margin-bottom: 16px;

    font-size: 200%;
`;

export const ReactionEmojiSelectTypography = styled(Typography)`
    align-items: center;

    margin-bottom: 16px;
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