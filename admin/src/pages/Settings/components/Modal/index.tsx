import React, { useEffect, useRef, useState } from "react";

import { isNil } from "lodash";
import { Formik } from "formik";

import { Form, InputRenderer, useNotification, useStrapiApp } from "@strapi/admin/strapi-admin";

import {
  Button, 
  Divider,
  Grid,
  GridItem,
  ModalLayout, 
  ModalBody, 
  ModalHeader, 
  ModalFooter,
  Loader,
  TextInput,
  Toggle,
  Typography } from '@strapi/design-system';
import { getMessage } from "../../../../utils";
import { pluginId } from "../../../../pluginId";
import useUtils from "../../../../hooks/useUtils";
import { ReactionTypeSwitch } from "./styles";
import { ReactionEmojiSelect } from "../ReactionEmojiSelect";
import { ToBeFixed } from "../../../../../../types";

type CUModalProps = {
  data: any;
  isLoading: boolean;
  onClose: Function;
  onSubmit: (values: any) => void | Promise<any>;
};

const CUModal = ({ data = {}, isLoading = false, onSubmit, onClose }: CUModalProps) => {
  const toggleNotification = useNotification();
  const slugGenerationTimeout = useRef<any>();
  const [slugSource, setSlugSource] = useState();
  const [slug, setSlug] = useState(data.slug || '');
  const [imageVariant, setImageVariant] = useState(isNil(data.emoji));
  const { slugMutation } = useUtils(toggleNotification);
  const fields = useStrapiApp('reactionsPlugin', (state) => state.customFields);

  useEffect(() => {
    slugMutation.reset();
    clearTimeout(slugGenerationTimeout.current);

    if (slugSource) {
      slugGenerationTimeout.current = setTimeout(async () => {
        const slug = await slugMutation.mutateAsync({
          value: slugSource,
          id: data.id,
        });
        setSlug(slug);
      }, 1000);
    }
  }, [slugSource]);

  const handleImageVariantChange = () => setImageVariant(!imageVariant);

  const submitForm = async (values: any) => onSubmit({
    ...values,
    image: imageVariant ? values.image : null,
    emoji: imageVariant ? null : values.emoji,
    emojiFallbackUrl: imageVariant ? null : values.emojiFallbackUrl,
    slug: slug || values.slug,
  });

  const formLocked = slugMutation.isPending;

  return (<Formik
    initialValues={data}
    enableReinitialize={true}
    onSubmit={submitForm}>
    {({ handleSubmit, setFieldValue, values }) => (
      <Form method="POST" onSubmit={(e: any) => handleSubmit(e)}>
        <ModalLayout onClose={onClose} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              {getMessage(`page.settings.modal.title.${isNil(data) ? 'create' : 'update'}`)}
            </Typography>
          </ModalHeader>
          <ModalBody>
            <div>
              <ReactionTypeSwitch>
                <Toggle size="S"
                  hint={getMessage("page.settings.form.type.hint")}
                  label={getMessage("page.settings.form.type.label")}
                  name="enable-provider"
                  onLabel={getMessage("page.settings.form.type.image.label")}
                  offLabel={getMessage("page.settings.form.type.emoji.label")}
                  checked={imageVariant}
                  onChange={handleImageVariantChange} />
              </ReactionTypeSwitch>
              <Divider useMargin />
              <Grid gap={4}>
                <GridItem col={4} xs={12}>
                  { imageVariant && (<InputRenderer
                    customInputs={fields}
                    intlLabel={{ id: `${pluginId}.page.settings.form.icon.label` }}
                    multiple={false}
                    //@ts-ignore
                    type="media"
                    name="icon"
                    value={values.icon || undefined}
                    required={true}
                    onChange={({ target: { value } }: ToBeFixed) =>
                      setFieldValue("icon", value, false)
                    }
                  />)}
                  { !imageVariant && (<ReactionEmojiSelect value={values.emoji} onChange={setFieldValue} />)}
                </GridItem>
                <GridItem col={8} xs={12}>
                  <div>
                    <Grid>
                      <GridItem col={12}>
                        <TextInput
                          type="text"
                          name="name"
                          label={getMessage(
                            "page.settings.form.name.label"
                          )}
                          value={values.name}
                          onChange={({ target: { value } }: ToBeFixed) => {
                            setSlugSource(value);
                            return setFieldValue("name", value, false);
                          }
                          }
                        />
                      </GridItem>
                    </Grid>
                    <Grid>
                      <GridItem col={12}>
                        <TextInput
                          type="text"
                          name="slug"
                          label={getMessage(
                            "page.settings.form.slug.label"
                          )}
                          hint={getMessage(
                            "page.settings.form.slug.hint"
                          )}
                          value={slug}
                          disabled={true}
                          endAction={slugMutation.isPending && (<Loader small />)}
                        />
                      </GridItem>
                    </Grid>
                  </div>
                </GridItem>
              </Grid>
            </div>
          </ModalBody>
          <ModalFooter startActions={<Button onClick={onClose} variant="tertiary">
            {getMessage("page.settings.modal.action.cancel")}
          </Button>} endActions={<>
            <Button onClick={handleSubmit} disabled={formLocked} loading={isLoading}>{getMessage("page.settings.modal.action.submit")}</Button>
          </>} />
        </ModalLayout>
      </Form>)}
  </Formik>)
};

export default CUModal;