import styled from "styled-components";

import { Box } from '@strapi/design-system/Box';
import { ToggleInput } from '@strapi/design-system/ToggleInput';

export const ReactionTypeSwitch = styled(Box)`
   
    ${ToggleInput} {
        width: 320px;
        margin: 0 auto;
    }
`;
