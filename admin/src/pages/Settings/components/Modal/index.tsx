import { Button, Divider, Field as NativeField, Flex, Grid, Loader, Modal, Toggle, Typography } from '@strapi/design-system';

import { Form, InputProps, useNotification } from '@strapi/strapi/admin';

import { StrapiImage, Field } from '@sensinum/strapi-utils';

import { isArray, isEmpty, isNil } from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CTReactionType } from '../../../../../../@types';
import useUtils from '../../../../hooks/useUtils';

import { getMessage } from '../../../../utils';
import { ReactionEmojiSelect } from '../ReactionEmojiSelect';
import { ReactionTypeSwitch } from './styles';
import { reactionForm } from '../../../../schemas';
import { ZodIssue } from 'zod';

type CUModalProps = {
  data: any;
  fields: any;
  trigger?: React.ReactNode;
  isModalOpened: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void | Promise<any>;
};

export type ReactionFormPayload = CTReactionType & {
  name: string;
  slug: string
  emoji?: string;
  image?: StrapiImage;
};

type ReactionFormErrors = {
  [key: keyof ReactionFormPayload]: string;
}

type MediaFieldType = Omit<InputProps, 'options' | 'type'> & {
  value: any;
  multiple: boolean;
};

const CUModal = ({ data = {}, fields, isLoading = false, isModalOpened = false, trigger, onSubmit, onClose }: CUModalProps) => {
  const { toggleNotification } = useNotification();
  const slugGenerationTimeout = useRef<NodeJS.Timeout>();
  const [slugSource, setSlugSource] = useState<string>();
  const [slug, setSlug] = useState(data.slug || '');
  const [errors, setErrors] = useState<ReactionFormErrors>({});
  const [lockWindow, setLockWindow] = useState<boolean>();
  const [imageVariant, setImageVariant] = useState(isNil(data.emoji));
  const { slugMutation } = useUtils(toggleNotification);

  useEffect(() => {
    slugMutation.reset();
    clearTimeout(slugGenerationTimeout.current);

    if (slugSource) {
      setLockWindow(true);

      slugGenerationTimeout.current = setTimeout(async () => {
        const slug = await slugMutation.mutateAsync({
          value: slugSource,
          documentId: data.documentId,
        });

        setSlug(slug);
        setLockWindow(false);
      }, 1000);
    }
  }, [slugSource]);

  const handleImageVariantChange = () => setImageVariant(!imageVariant);

  const setFormErrors = (errors: Array<ZodIssue>) => {
    if (!isEmpty(errors)) {
      setErrors(errors.reduce((acc, error: ZodIssue) => {
        const path = isArray(error?.path) ? error?.path.join('.') : error?.path;
        return {
          ...acc,
          [path]: getMessage(error?.message),
        };
      }, {}));
    } else {
      setErrors({});
    }
  };

  const submitForm = async (e: React.MouseEvent, values: ReactionFormPayload) => {
    e.preventDefault();

    if (!formLocked) {
      const paload = {
        ...values,
        image: imageVariant ? values.image : null,
        emoji: imageVariant ? null : values.emoji,
        emojiFallbackUrl: imageVariant ? null : values.emojiFallbackUrl,
        slug: slug || values.slug,
      };

      const { success, error } = reactionForm.safeParse(paload)
      if (success) {
        return onSubmit(paload);
      }
      setFormErrors(error?.issues);
    }
  };

  const formLocked = slugMutation.isPending || lockWindow;

  const MediaField = fields.media as React.ComponentType<MediaFieldType>;

  return (
    <Modal.Root
      open={isModalOpened}
      onOpenChange={onClose}
      labelledBy="title">
      {trigger && (<Modal.Trigger>{trigger}</Modal.Trigger>)}
      <Modal.Content>
        <Form
          method="POST"
          initialValues={data}
        >
          {({ values, onChange }) => (
            <>
              <Modal.Header>
                <Typography fontWeight="bold" textColor="neutral800" tag="h2" id="title">
                  {getMessage(`page.settings.modal.title.${isNil(data) ? 'create' : 'update'}`)}
                </Typography>
              </Modal.Header>
              <Modal.Body>
                <Flex direction="column" gap={4}>
                  <ReactionTypeSwitch>
                    <Field
                      name="enable-provider"
                      hint={getMessage('page.settings.form.type.hint')}
                      label={getMessage('page.settings.form.type.label')}>
                      <Toggle
                        width="100%"
                        size="S"
                        onLabel={getMessage('page.settings.form.type.image.label')}
                        offLabel={getMessage('page.settings.form.type.emoji.label')}
                        checked={imageVariant}
                        onChange={handleImageVariantChange}
                      />
                    </Field>
                  </ReactionTypeSwitch>
                  <Divider width="100%" />
                  <Grid.Root width="100%" gap={4}>
                    <Grid.Item col={4} xs={12}>
                      {imageVariant && (
                        <Field
                          name="icon"
                          label={getMessage('page.settings.form.icon.label')}
                          error={errors?.icon}
                          required>
                          <MediaField
                            multiple={false}
                            name="icon"
                            value={values.icon || undefined}
                            required={imageVariant}
                          />
                        </Field>
                      )}
                      {!imageVariant && (<ReactionEmojiSelect
                        value={values.emoji}
                        error={errors?.emoji}
                        required={!imageVariant}
                        onChange={onChange} />)}
                    </Grid.Item>
                    <Grid.Item col={8} xs={12}>
                      <Flex width="100%" direction="column" gap={4}>
                        <Grid.Root width="100%">
                          <Grid.Item col={12}>
                            <Field
                              name="name"
                              label={getMessage('page.settings.form.name.label')}
                              error={errors?.name}
                              required>
                              <NativeField.Input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setSlugSource(e.target.value);
                                  onChange(e);
                                }}
                                required
                              />
                            </Field>
                          </Grid.Item>
                        </Grid.Root>
                        <Grid.Root width="100%">
                          <Grid.Item col={12}>
                            <Field
                              name="slug"
                              label={getMessage('page.settings.form.slug.label')}
                              hint={getMessage('page.settings.form.slug.hint')}
                              error={errors?.slug}
                              required
                            >
                              <NativeField.Input
                                type="text"
                                value={slug}
                                disabled={true}
                                name="slug"
                                endAction={slugMutation.isPending && (<Loader small />)}
                                required
                              />
                            </Field>
                          </Grid.Item>
                        </Grid.Root>
                      </Flex>
                    </Grid.Item>
                  </Grid.Root>
                </Flex>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button
                    onClick={onClose}
                    variant="tertiary">
                    {getMessage('page.settings.modal.action.cancel')}
                  </Button>
                </Modal.Close>
                <Button
                  disabled={formLocked}
                  loading={isLoading}
                  type="submit"
                  onClick={(e: React.MouseEvent) => submitForm(e, values)}
                >
                  {getMessage('page.settings.modal.action.submit')}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Form>
      </Modal.Content>
    </Modal.Root>
  );
};

export default CUModal;