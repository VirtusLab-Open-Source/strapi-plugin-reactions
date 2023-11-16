import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';

import { Button } from '@strapi/design-system/Button';
import { CarouselInput } from '@strapi/design-system';
import { Flex } from '@strapi/design-system/Flex';
import { Icon } from '@strapi/design-system/Icon';

import { EmotionHappy } from '@strapi/icons';

import { ReactionEmojiSelectContainer, ReactionEmojiSelectDisplay, ReactionEmojiSelectInner, ReactionEmojiSelectPopover, ReactionEmojiSelectTypography } from './styles';
import { getMessage } from '../../../../utils';

type ReactionEmojiSelectProps = {
    value: string;
    onChange: Function;
};

type ReactionEmojiProps = Pick<EmojiClickData, "emoji" | "imageUrl">;

export const ReactionEmojiSelect = ({ value, onChange }: ReactionEmojiSelectProps) => {

    const [selectorVisible, setSelectorVisible] = useState(false);
    const [theme, setTheme] = useState(undefined);
    const buttonRef = useRef();

    const handleEmojiSelect = ({ emoji, imageUrl }: ReactionEmojiProps) => {
        onChange("emoji", emoji, false);
        onChange("emojiFallbackUrl", imageUrl, false);
        setSelectorVisible(false);
    };

    useEffect(() => {
        setTheme(window.localStorage?.STRAPI_THEME);
    }, []);

    return (<ReactionEmojiSelectContainer>
        <CarouselInput
            label={getMessage("page.settings.form.emoji.label")}
            required>
            <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
            >
                <ReactionEmojiSelectInner>
                    { !value && (<><Icon
                        as={EmotionHappy}
                        aria-hidden
                        width="30px"
                        height="24px"
                        color="primary600"
                        marginBottom={3}
                    />
                    <ReactionEmojiSelectTypography
                        variant="pi"
                        fontWeight="bold"
                        textColor="neutral600"
                        style={{ textAlign: 'center' }}
                        as="span"
                    >
                        {getMessage("page.settings.form.emoji.empty")}
                    </ReactionEmojiSelectTypography>
                    </>)}

                    {value && (<ReactionEmojiSelectDisplay>
                        {value}
                    </ReactionEmojiSelectDisplay>)}

                    <Button ref={buttonRef} onClick={() => setSelectorVisible(s => !s)} variant='secondary'>{getMessage("page.settings.form.emoji.button.label")}</Button>
                    {selectorVisible && <ReactionEmojiSelectPopover centered source={buttonRef} spacing={16}>
                        <EmojiPicker 
                        theme={theme} 
                        emojiStyle={EmojiStyle.NATIVE}
                        searchPlaceholder={getMessage("page.settings.form.emoji.plugin.search.label")}
                        onEmojiClick={handleEmojiSelect} />
                    </ReactionEmojiSelectPopover>}
                </ReactionEmojiSelectInner>
            </Flex>
        </CarouselInput>
        <input type="hidden" value={value} />
    </ReactionEmojiSelectContainer>)
}