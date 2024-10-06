import { Button, CarouselInput, Field, Flex, Popover } from '@strapi/design-system';

import { EmotionHappy } from '@strapi/icons';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { getMessage } from '../../../../utils';

import { ReactionEmojiSelectContainer, ReactionEmojiSelectDisplay, ReactionEmojiSelectInner, ReactionEmojiSelectPopoverContent, ReactionEmojiSelectTypography } from './styles';
import { FieldValue } from '@strapi/strapi/admin';

type ReactionEmojiSelectProps = {
  value: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onChange: FieldValue['onChange'];
};

type ReactionEmojiProps = Pick<EmojiClickData, 'emoji' | 'imageUrl'>;

export const ReactionEmojiSelect = ({ value, error, hint, required, onChange }: ReactionEmojiSelectProps) => {

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [theme, setTheme] = useState(undefined);
  const buttonRef = useRef<HTMLElement>();

  const handleEmojiSelect = ({ emoji, imageUrl }: ReactionEmojiProps) => {
    onChange('emoji', emoji);
    onChange('emojiFallbackUrl', imageUrl);
    setSelectorVisible(false);
  };

  useEffect(() => {
    setTheme(window.localStorage?.STRAPI_THEME);
  }, []);

  const handleSelectorVisibleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectorVisible(!selectorVisible);
  };

  return (<ReactionEmojiSelectContainer>
    <Field.Root hint={hint} error={error ? getMessage(error) : error} required={required}>
      <CarouselInput
        label={getMessage('page.settings.form.emoji.label')}
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
                {getMessage('page.settings.form.emoji.empty')}
              </ReactionEmojiSelectTypography>
            </Flex>)}

            {value && (<ReactionEmojiSelectDisplay
              direction="row"
              justifyContent="center"
              alignItems="center">
              {value}
            </ReactionEmojiSelectDisplay>)}


            <Popover.Root open={selectorVisible}>
              <Popover.Trigger>
                <Button onClick={handleSelectorVisibleToggle} variant="secondary">{getMessage('page.settings.form.emoji.button.label')}</Button>
              </Popover.Trigger>
              <Popover.Content centered>
                <ReactionEmojiSelectPopoverContent spacing={16}>
                  <EmojiPicker
                    theme={theme}
                    emojiStyle={EmojiStyle.NATIVE}
                    searchPlaceholder={getMessage('page.settings.form.emoji.plugin.search.label')}
                    onEmojiClick={handleEmojiSelect} />
                </ReactionEmojiSelectPopoverContent>
              </Popover.Content>
            </Popover.Root>
          </ReactionEmojiSelectInner>
        </Flex>
      </CarouselInput>
      <input type="hidden" name="emoji" value={value} />
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  </ReactionEmojiSelectContainer>);
};