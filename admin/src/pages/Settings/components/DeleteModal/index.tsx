import React from "react";

import { isNil } from "lodash";

import { Button } from '@strapi/design-system/Button';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { ExclamationMarkCircle, Trash } from "@strapi/icons";
import { getMessage } from "../../../../utils";
import { Id } from "strapi-typed";


type DeleteModalProps = {
  data: any;
  isLoading: boolean;
  onClose: Function;
  onSubmit: (id: Id) => void | Promise<any>;
};

const DeleteModal = ({ data = {}, isLoading = false, onSubmit, onClose }: DeleteModalProps) => {
  return (<Dialog onClose={onClose} title={getMessage("page.settings.modal.delete.title")} isOpen={!isNil(data)}>
    <DialogBody icon={<ExclamationMarkCircle />}>
      <Stack size={2}>
        <Flex justifyContent="center">
          <Typography id="confirm-description">
            {getMessage({
              id: "page.settings.modal.delete.description",
              props: {
                name: data.name,
              },
            })}
          </Typography>
        </Flex>
      </Stack>
    </DialogBody>
    <DialogFooter startAction={<Button
      onClick={onClose}
      disabled={isLoading}
      variant="tertiary">
      {getMessage("page.settings.modal.action.delete.cancel")}
    </Button>} endAction={<Button
      onClick={() =>
        onSubmit(data.id)}
      variant="danger-light"
      loading={isLoading}
      disabled={isLoading}
      startIcon={<Trash />}>
      {getMessage("page.settings.modal.action.delete.submit")}
    </Button>} />
  </Dialog>)
};

export default DeleteModal;