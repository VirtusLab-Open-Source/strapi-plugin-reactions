import React from "react";

import {
  Flex,
  Field as NativeField
} from '@strapi/design-system';
import { FieldContent } from "./styles";

type FieldProps = {
  children: React.ReactNode | Array<React.ReactNode>;
  label?: string;
  hint?: string;
  required?: boolean;
};

const Field = ({
  children,
  hint,
  label,
  required }: FieldProps) => {
  return (<NativeField.Root width="100%" hint={hint} required={required}>
    <Flex width="100%" direction="column" alignItems="flex-start" gap={1}>
      <NativeField.Label>{label}</NativeField.Label>
      <FieldContent width="100%" direction="column" alignItems="flex-start">
        {children}
      </FieldContent>
      <NativeField.Hint />
      <NativeField.Error />
    </Flex>
  </NativeField.Root>)
};

export default Field;