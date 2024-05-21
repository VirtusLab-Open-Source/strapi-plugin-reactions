import React, { FormEvent, useEffect, useRef, useState } from "react";

import { isNil } from "lodash";
import { Formik } from "formik";

import { Form, InputProps, useNotification } from "@strapi/admin/strapi-admin";

import {
  Button,
  Divider,
  Field as NativeField,
  Flex,
  Grid,
  GridItem,
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Loader,
  Toggle,
  Typography
} from '@strapi/design-system';

import { getMessage } from "../../../../utils";
import useUtils from "../../../../hooks/useUtils";
import { ReactionTypeSwitch } from "./styles";
import { ReactionEmojiSelect } from "../ReactionEmojiSelect";
import { ReactionTypeEntity, ToBeFixed } from "../../../../../../types";
import Field from "../../../../components/Field";

type CUModalProps = {
  data: any;
  fields: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void | Promise<any>;
};

export type ReactionFormPayload = ReactionTypeEntity & {
  name: string;
  emoji?: string;
  image?: any; // TODO
};

type MediaFieldType = Omit<InputProps, 'options' | 'type'> & {
  value: any;
  multiple: boolean;
  onChange: (e: React.ChangeEvent) => void;
};

const CUModal = ({ data = {}, fields, isLoading = false, onSubmit, onClose }: CUModalProps) => {
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
          id: data.id,
        });
        setSlug(slug);
        setLockWindow(false);
      }, 1000);
    }
  }, [slugSource]);

  const handleImageVariantChange = () => setImageVariant(!imageVariant);

  const submitForm = async (values: ReactionFormPayload) => {
    if (!formLocked) {
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

  return (<Formik
    initialValues={data}
    enableReinitialize={true}
    onSubmit={submitForm}>
    {({ handleSubmit, setFieldValue, values }) => (
      <Form method="POST" onSubmit={(e: any) => handleSubmit(e)}>
        <ModalLayout onClose={onClose} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" tag="h2" id="title">
              {getMessage(`page.settings.modal.title.${isNil(data) ? 'create' : 'update'}`)}
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={4}>
              <ReactionTypeSwitch>
                <Field
                  hint={getMessage("page.settings.form.type.hint")}
                  label={getMessage("page.settings.form.type.label")}>
                  <Toggle
                    width="100%"
                    size="S"
                    name="enable-provider"
                    onLabel={getMessage("page.settings.form.type.image.label")}
                    offLabel={getMessage("page.settings.form.type.emoji.label")}
                    checked={imageVariant}
                    onChange={handleImageVariantChange} />
                </Field>
              </ReactionTypeSwitch>
              <Divider width="100%" />
              <Grid width="100%" gap={4}>
                <GridItem col={4} xs={12}>
                  {imageVariant && (<Field label={getMessage("page.settings.form.icon.label")} required>
                    <MediaField
                      multiple={false}
                      name="icon"
                      value={values.icon || undefined}
                      required={true}
                      onChange={({ target: { value } }: ToBeFixed) =>
                        setFieldValue("icon", value, false)
                      }
                    />
                  </Field>)}
                  {!imageVariant && (<ReactionEmojiSelect value={values.emoji} onChange={setFieldValue} />)}
                </GridItem>
                <GridItem col={8} xs={12}>
                  <Flex width="100%" direction="column" gap={4}>
                    <Grid width="100%">
                      <GridItem col={12}>
                        <Field label={getMessage("page.settings.form.name.label")}>
                          <NativeField.Input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={({ target: { value } }: ToBeFixed) => {
                              setSlugSource(value);
                              return setFieldValue("name", value, false);
                            }
                            }
                          />
                        </Field>
                      </GridItem>
                    </Grid>
                    <Grid width="100%">
                      <GridItem col={12}>
                        <Field
                          label={getMessage("page.settings.form.slug.label")}
                          hint={getMessage("page.settings.form.slug.hint")}>
                          <NativeField.Input
                            type="text"
                            name="slug"
                            value={slug}
                            disabled={true}
                            endAction={slugMutation.isPending && (<Loader small />)}
                          />
                        </Field>
                      </GridItem>
                    </Grid>
                  </Flex>
                </GridItem>
              </Grid>
            </Flex>
          </ModalBody>
          <ModalFooter
            startActions={<Button
              onClick={onClose}
              variant="tertiary">
              {getMessage("page.settings.modal.action.cancel")}
            </Button>}
            endActions={<Button
              onClick={(e: unknown) => handleSubmit(e as FormEvent<HTMLFormElement>)}
              disabled={formLocked}
              loading={isLoading}>
              {getMessage("page.settings.modal.action.submit")}
            </Button>} />
        </ModalLayout>
      </Form>)}
  </Formik>)
};

export default CUModal;