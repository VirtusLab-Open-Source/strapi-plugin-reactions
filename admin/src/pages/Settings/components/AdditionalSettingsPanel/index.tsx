import React from "react";
import { Form } from "@strapi/strapi/admin";
import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Typography,
} from "@strapi/design-system";
import { Check } from "@strapi/icons";
import { getMessage } from "../../../../utils";
import { BOX_DEFAULT_PROPS } from "../../common/const";

type AdditionalSettingsPanelProps = {
  blockedAuthorProps: string[];
  isSubmitting: boolean;
  onSubmit: (values: { blockedAuthorProps: string }) => Promise<void>;
};

export const AdditionalSettingsPanel = ({
  blockedAuthorProps,
  isSubmitting,
  onSubmit,
}: AdditionalSettingsPanelProps) => {
  return (
    <Box width="100%" {...BOX_DEFAULT_PROPS}>
      <Typography variant="delta" as="h2">
        {getMessage("page.settings.section.additionalSettings.title")}
      </Typography>
      <Box padding={1} />
      <Form
        method="POST"
        width="auto"
        height="auto"
        onSubmit={onSubmit}
        initialValues={{
          blockedAuthorProps: blockedAuthorProps.join(", "),
        }}
      >
        {({ values, onChange }) => (
          <>
            <Grid.Root gap={4} width="100%">
              <Grid.Item col={12} s={12} xs={12}>
                <Field.Root
                  width="100%"
                  hint={getMessage(
                    "page.settings.form.blockedAuthorProps.hint",
                  )}
                >
                  <Field.Label htmlFor="blockedAuthorProps">
                    {getMessage("page.settings.form.blockedAuthorProps.label")}
                  </Field.Label>
                  <Field.Input
                    name="blockedAuthorProps"
                    value={values.blockedAuthorProps}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChange("blockedAuthorProps", event.target.value);
                    }}
                  />
                  <Field.Hint />
                </Field.Root>
              </Grid.Item>
            </Grid.Root>
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                startIcon={<Check />}
                loading={isSubmitting}
              >
                {getMessage("page.settings.action.savePluginConfig")}
              </Button>
            </Flex>
          </>
        )}
      </Form>
    </Box>
  );
};
