import React, { MouseEvent, MouseEventHandler } from "react";

import { 
  Button, 
  Dialog, 
  DialogBody, 
  DialogFooter, 
  Flex, 
  Typography } from '@strapi/design-system';
import { WarningCircle } from "@strapi/icons";

type ConfirmationModalProps = {
  isVisible: boolean;
  isLoading: boolean;
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
  isVisible = false,
  isLoading = false,
  title,
  labelCancel,
  labelConfirm,
  iconConfirm,
  onConfirm,
  onClose }: ConfirmationModalProps) => {
  return (<Dialog onClose={onClose} title={title} isOpen={isVisible}>
    <DialogBody icon={<WarningCircle />}>
      <div>
        <Flex justifyContent="center">
          <Typography id="confirm-description">
            {children}
          </Typography>
        </Flex>
      </div>
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