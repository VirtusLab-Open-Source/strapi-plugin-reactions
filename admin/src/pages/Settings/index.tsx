import React, { useMemo, useState } from "react";
import { Id } from "strapi-typed";

import {
  CheckPermissions,
  LoadingIndicatorPage,
  useNotification,
  useRBAC,
  useFocusWhenNavigate,
  useOverlayBlocker,
} from "@strapi/helper-plugin";
import { Main } from "@strapi/design-system/Main";
import { ContentLayout, HeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { Pencil, Plus, Trash } from "@strapi/icons";
import { IconButton } from "@strapi/design-system/IconButton";
import { Flex } from "@strapi/design-system/Flex";
import { Table, Thead, Tbody, TFooter, Tr, Th, Td } from "@strapi/design-system/Table";
import { Typography } from "@strapi/design-system/Typography";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";

import pluginPermissions from "../../permissions";
import useConfig from "../../hooks/useConfig";
import { getMessage } from "../../utils";
import CUModal from "./components/Modal";
import { ReactionIcon } from "./components/ReactionIcon";
import DeleteModal from "./components/DeleteModal";

const Settings = () => {
  useFocusWhenNavigate();

  const toggleNotification = useNotification();
  const { lockApp, unlockApp } = useOverlayBlocker();

  const viewPermissions = useMemo(
    () => ({
      access: pluginPermissions.settings,
      change: pluginPermissions.settingsChange,
    }),
    []
  );

  const {
    isLoading: isLoadingForPermissions,
    allowedActions: { canChange },
  } = useRBAC(viewPermissions);

  const [isModalOpened, setModalOpened] = useState(false);
  const [modalEntity, setModalEntity] = useState(undefined);
  const [entityToDelete, setEntityToDelete] = useState<any>(undefined);

  const { fetch, submitMutation, deleteMutation } =
    useConfig(toggleNotification);
  const {
    data,
    isLoading: isConfigLoading,
    err: configErr,
  }: any = fetch;

  const { types = [] } = data || {};

  const isLoading =
    isLoadingForPermissions ||
    isConfigLoading;
  const isError = configErr;

  const preparePayload = (form: any) => {
    return form;
  }

  const handleCUD = async (form: any) => {
    if (canChange) {
      lockApp();
      try {
        const payload = preparePayload(form);
        await submitMutation.mutateAsync(payload);
      } finally {
        setModalOpened(false);
        setModalEntity(undefined);
      }
      unlockApp();
    }
  };

  const handleDelete = async (id: Id) => {
    if (canChange) {
      lockApp();
      try {
        await deleteMutation.mutateAsync(id);
      } finally {
        setEntityToDelete(undefined);
      }
      unlockApp();
    }
  };

  const handleOpenModal = (entity: any = undefined) => {
    setModalOpened(true);
    setModalEntity(entity);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setModalEntity(undefined);
  };

  const handleDeleteConfirmation = (entity: any) => {
    setEntityToDelete(entity);
  };

  const handleDeleteDiscard = () => {
    setEntityToDelete(undefined);
  };

  if (isLoading || isError) {
    return (
      <LoadingIndicatorPage>
        {getMessage("page.settings.loading")}
      </LoadingIndicatorPage>
    );
  }

  return (
    <Main>
      <HeaderLayout
        title={getMessage("page.settings.header.title")}
        subtitle={getMessage("page.settings.header.description")}
        primaryAction={
          <CheckPermissions
            permissions={pluginPermissions.settingsChange}
          >
            <Button
              type="submit"
              startIcon={<Plus />}
              onClick={(e: React.FormEvent) => { e.preventDefault(); handleOpenModal(); }}
            >
              {getMessage("page.settings.action.create")}
            </Button>
          </CheckPermissions>
        }
      />
      <ContentLayout>
        <Table colCount={5} rowCount={1} footer={<TFooter
          onClick={(e: React.FormEvent) => { e.preventDefault(); handleOpenModal(); }}
          icon={<Plus />}>
          {getMessage("page.settings.table.action.add")}
        </TFooter>}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">{getMessage("page.settings.table.headers.icon")}</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">{getMessage("page.settings.table.headers.name")}</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">{getMessage("page.settings.table.headers.slug")}</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">{getMessage("page.settings.table.headers.usedIn")}</Typography>
              </Th>
              <Th>
                <VisuallyHidden>{getMessage("page.settings.table.headers.actions")}</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {types.map(entry => <Tr key={entry.id}>
              <Td>
                { (entry.icon && !entry.emoji) && (<ReactionIcon src={entry.icon?.url} />) }
                { (!entry.icon && entry.emoji) && (<>{ entry.emoji }</>)}
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {entry.name}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {entry.slug}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">

                </Typography>
              </Td>
              <Td>
                <Flex>
                  <IconButton onClick={() => handleOpenModal(entry)} label={getMessage("page.settings.table.action.edit")} noBorder icon={<Pencil />} />
                  <Box paddingLeft={1}>
                    <IconButton onClick={() => handleDeleteConfirmation(entry)} label={getMessage("page.settings.table.action.delete")} noBorder icon={<Trash />} />
                  </Box>
                </Flex>
              </Td>
            </Tr>)}
          </Tbody>
        </Table>

        {(isModalOpened && canChange) && (<CUModal
          data={modalEntity}
          isLoading={submitMutation.isLoading}
          onSubmit={handleCUD}
          onClose={handleCloseModal} />)}

        {(entityToDelete && canChange) && (<DeleteModal
          data={entityToDelete}
          isLoading={deleteMutation.isLoading}
          onSubmit={handleDelete}
          onClose={handleDeleteDiscard}
        />)}
      </ContentLayout>
    </Main>);
};

export default Settings;
