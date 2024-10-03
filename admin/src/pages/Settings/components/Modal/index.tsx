import { Button, Divider, Field as NativeField, Flex, Grid, Loader, Modal, Toggle, Typography } from '@strapi/design-system';

import { Form, InputProps, useNotification } from '@strapi/strapi/admin';

import { StrapiImage } from '@virtuslab/strapi-utils';

import { isNil } from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CTReactionType } from '../../../../../../@types';
import Field from '../../../../components/Field';
import useUtils from '../../../../hooks/useUtils';

import { getMessage } from '../../../../utils';
import { ReactionEmojiSelect } from '../ReactionEmojiSelect';
import { ReactionTypeSwitch } from './styles';

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
  emoji?: string;
  image?: StrapiImage;
};

type MediaFieldType = Omit<InputProps, 'options' | 'type'> & {
  value: any;
  multiple: boolean;
};

const CUModal = ({ data = {}, fields, isLoading = false, isModalOpened = false, trigger, onSubmit, onClose }: CUModalProps) => {
  const { toggleNotification } = useNotification();
  const slugGenerationTimeout = useRef<NodeJS.Timeout>();
  const [slugSource, setSlugSource] = useState<string>();
  const [slug, setSlug] = useState(data.slug || '');
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

  const submitForm = async (values: ReactionFormPayload) => {
    if (!formLocked) {
      console.log(values);
      return onSubmit({
        ...values,
        image: imageVariant ? values.image : null,
        emoji: imageVariant ? null : values.emoji,
        emojiFallbackUrl: imageVariant ? null : values.emojiFallbackUrl,
        slug: slug || values.slug,
      });
    }
  };

  const formLocked = slugMutation.isPending || lockWindow;

  const MediaField = fields.media as React.ComponentType<MediaFieldType>;

  return (
    <Modal.Root open={isModalOpened} onClose={onClose} labelledBy="title">
      {trigger && (<Modal.Trigger>{trigger}</Modal.Trigger>)}
      <Modal.Content>
        <Form
          method="POST"
          initialValues={data}
          onSubmit={submitForm}
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
                          required>
                          <MediaField
                            multiple={false}
                            name="icon"
                            value={values.icon || undefined}
                            required={true}
                          />
                        </Field>
                      )}
                      {!imageVariant && (<ReactionEmojiSelect value={values.emoji} onChange={onChange} />)}
                    </Grid.Item>
                    <Grid.Item col={8} xs={12}>
                      <Flex width="100%" direction="column" gap={4}>
                        <Grid.Root width="100%">
                          <Grid.Item col={12}>
                            <Field name="name" label={getMessage('page.settings.form.name.label')}>
                              <NativeField.Input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setSlugSource(e.target.value);
                                  onChange(e);
                                }}
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
                            >
                              <NativeField.Input
                                type="text"
                                value={slug}
                                disabled={true}
                                name="slug"
                                endAction={slugMutation.isPending && (<Loader small />)}
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