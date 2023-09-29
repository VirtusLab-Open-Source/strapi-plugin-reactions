import React from 'react';
import { ReactionIconStyles } from './styles';

type ReactionIconProps = {
    src: string;
};

export const ReactionIcon = ({ src }: ReactionIconProps) => {
    return (<ReactionIconStyles>
        <img src={src} />
    </ReactionIconStyles>)
}