import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';

import { Button, CarouselInput, Flex } from '@strapi/design-system';

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
    const buttonRef = useRef<HTMLElement>();

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
                <ReactionEmojiSelectInner
                    direction="column"
                    gap={3}
                    justifyContent="center"
                    alignItems="center">
                    {!value && (<Flex direction="column" gap={3}>
                        <EmotionHappy
                            aria-hidden
                            width="30px"
                            height="24px"
                            color="primary600"
                        />
                        <ReactionEmojiSelectTypography
                            variant="pi"
                            fontWeight="bold"
                            textColor="neutral600"
                            style={{ textAlign: 'center' }}
                            tag="span"
                        >
                            {getMessage("page.settings.form.emoji.empty")}
                        </ReactionEmojiSelectTypography>
                    </Flex>)}

                    {value && (<ReactionEmojiSelectDisplay
                        direction="row"
                        justifyContent="center"
                        alignItems="center">
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