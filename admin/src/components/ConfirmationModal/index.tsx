import React from "react";

import { Button } from '@strapi/design-system/Button';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { ExclamationMarkCircle } from "@strapi/icons";

type ConfirmationModalProps = {
  isVisible: boolean;
  isLoading: boolean;
  title: string;
  children: React.ReactNode | Array<React.ReactNode>;
  labelCancel: string;
  labelConfirm: string;
  iconConfirm: React.ReactNode;
  onClose: Function;
  onConfirm: Function;
};

const ConfirmationModal = ({
  children,
  isVisible = false,
  isLoading = false,
  title,
  labelCancel,
  labelConfirm,
  iconConfirm,
  onConfirm,
  onClose }: ConfirmationModalProps) => {
  return (<Dialog onClose={onClose} title={title} isOpen={isVisible}>
    <DialogBody icon={<ExclamationMarkCircle />}>
      <Stack size={2}>
        <Flex justifyContent="center">
          <Typography id="confirm-description">
            {children}
          </Typography>
        </Flex>
      </Stack>
    </DialogBody>
    <DialogFooter startAction={<Button
      onClick={onClose}
      disabled={isLoading}
      variant="tertiary">
      {labelCancel}
    </Button>} endAction={<Button
      onClick={onConfirm}
      variant="danger-light"
      loading={isLoading}
      disabled={isLoading}
      startIcon={iconConfirm}>
      {labelConfirm}
    </Button>} />
  </Dialog>)
};

export default ConfirmationModal;