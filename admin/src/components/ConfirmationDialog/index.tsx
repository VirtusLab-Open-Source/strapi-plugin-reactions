import React, { MouseEvent, MouseEventHandler } from "react";

import {
  Button,
  Dialog,
  Flex,
  Typography
} from '@strapi/design-system';
import { WarningCircle } from "@strapi/icons";

type ConfirmationModalProps = {
  isVisible: boolean;
  isLoading: boolean;
  trigger?: React.ReactNode | Array<React.ReactNode>;
  title: string;
  children: React.ReactNode | Array<React.ReactNode>;
  labelCancel: string;
  labelConfirm: string;
  iconConfirm: React.ReactNode;
  onClose: () => void;
  onConfirm: MouseEventHandler<HTMLButtonElement> & ((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void);
};

const ConfirmationModal = ({
  children,
  trigger,
  isVisible = false,
  isLoading = false,
  title,
  labelCancel,
  labelConfirm,
  iconConfirm,
  onConfirm,
  onClose }: ConfirmationModalProps) => {
  return (<Dialog.Root open={isVisible}>
    {trigger && (<Dialog.Trigger>{trigger}</Dialog.Trigger>)}
    <Dialog.Content>
      <Dialog.Header>{title}</Dialog.Header>
      <Dialog.Body icon={<WarningCircle />}>
        <div>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {children}
            </Typography>
          </Flex>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Cancel>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="tertiary">
            {labelCancel}
          </Button>
        </Dialog.Cancel>
        <Dialog.Action>
          <Button
            onClick={onConfirm}
            variant="danger-light"
            loading={isLoading}
            disabled={isLoading}
            startIcon={iconConfirm}>
            {labelConfirm}
          </Button>
        </Dialog.Action>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>)
};

export default ConfirmationModal;