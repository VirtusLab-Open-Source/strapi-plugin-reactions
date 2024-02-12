import React, { useState } from "react";
import { Id } from "strapi-typed";
import { isNil } from "lodash";

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
import { Divider } from "@strapi/design-system/Divider";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { IconButton } from "@strapi/design-system/IconButton";
import { Flex } from "@strapi/design-system/Flex";
import { Stack } from "@strapi/design-system/Stack";
import { Table, Thead, Tbody, TFooter, Tr, Th, Td } from "@strapi/design-system/Table";
import { Typography } from "@strapi/design-system/Typography";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";

import { Pencil, Plus, Refresh, Trash } from "@strapi/icons";

import pluginPermissions from "../../permissions";
import useConfig from "../../hooks/useConfig";
import { getMessage } from "../../utils";
import CUModal from "./components/Modal";
import { ReactionIcon } from "./components/ReactionIcon";
import useUtils from "../../hooks/useUtils";
import ConfirmationModal from "../../components/ConfirmationModal";
import { AdminAction } from "./components/AdminAction";
import { ToBeFixed } from "../../../../types";

const DEFAULT_BOX_PROPS = {
  background: "neutral0",
  hasRadius: true,
  shadow: "filterShadow",
  padding: 6,
};

const Settings = () => {
  useFocusWhenNavigate();

  const toggleNotification = useNotification();
  const { lockApp, unlockApp } = useOverlayBlocker();

  const {
    isLoading: isLoadingForPermissions,
    allowedActions,
  } = useRBAC(pluginPermissions);

  const { canSettingsChange: canChange, canSettingsAdmin: canAdmin } = allowedActions;

  const [isModalOpened, setModalOpened] = useState(false);
  const [syncAssiciationConfirmationVisible, setSyncAssiciationConfirmationVisible] = useState(false);
  const [modalEntity, setModalEntity] = useState(undefined);
  const [entityToDelete, setEntityToDelete] = useState<any>(undefined);

  const { fetch, submitMutation, deleteMutation } =
    useConfig(toggleNotification);

  const { syncAssociationsMutation } = useUtils(toggleNotification);

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

  const handleSyncAssociationsConfirmation = () => {
    setSyncAssiciationConfirmationVisible(true);
  };

  const handleSyncAssociationsCancel = () => {
    setSyncAssiciationConfirmationVisible(false);
  };

  const handleSyncAssociations = async () => {
    if (canAdmin) {
      lockApp();
      try {
        await syncAssociationsMutation.mutateAsync();
      } finally {
        setSyncAssiciationConfirmationVisible(false);
      }
      unlockApp();
    }
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
        <Stack size={4}>
          <Box hasRadius={false} paddingBottom={6}>
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
                {types.map((entry: ToBeFixed) => <Tr key={entry.id}>
                  <Td>
                    {(entry.icon && !entry.emoji) && (<ReactionIcon src={entry.icon?.url} />)}
                    {(!entry.icon && entry.emoji) && (<>{entry.emoji}</>)}
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
          </Box>
          <CheckPermissions
            permissions={pluginPermissions.settingsAdmin}
          >
            <Box {...DEFAULT_BOX_PROPS}>
              <Stack size={4}>
                <Stack size={2}>
                  <Typography variant="delta" as="h2">
                    {getMessage("page.settings.section.administration-tools")}
                  </Typography>
                  <Typography variant="pi" as="h4">
                    {getMessage("page.settings.section.administration-tools.subtitle")}
                  </Typography>
                </Stack>
                <Grid gap={4}>
                  <GridItem col={12} s={12} xs={12}>
                    <Divider unsetMargin={false} />
                    <AdminAction
                      title={getMessage("page.settings.action.sync-associations.title")}
                      description={getMessage("page.settings.action.sync-associations.description")}
                      tip={getMessage("page.settings.action.sync-associations.tip")}>
                      <Button
                        variant="danger-light"
                        startIcon={<Refresh />}
                        onClick={handleSyncAssociationsConfirmation}
                      >
                        {getMessage("page.settings.action.sync-associations.button")}
                      </Button>

                      <ConfirmationModal
                        isVisible={syncAssiciationConfirmationVisible}
                        isLoading={syncAssociationsMutation.isLoading}
                        title={getMessage("page.settings.modal.title.sync-associations")}
                        labelCancel={getMessage("page.settings.modal.action.sync-associations.cancel")}
                        labelConfirm={getMessage("page.settings.modal.action.sync-associations.submit")}
                        iconConfirm={<Refresh />}
                        onConfirm={handleSyncAssociations}
                        onClose={handleSyncAssociationsCancel}
                      >
                        {getMessage(
                          "page.settings.modal.description.sync-associations"
                        )}
                      </ConfirmationModal>
                    </AdminAction>

                  </GridItem>
                </Grid>
              </Stack>
            </Box>
          </CheckPermissions>
        </Stack>

        {(isModalOpened && canChange) && (<CUModal
          data={modalEntity}
          isLoading={submitMutation.isLoading}
          onSubmit={handleCUD}
          onClose={handleCloseModal} />)}

        {(entityToDelete && canChange) && (<ConfirmationModal
          isVisible={!isNil(entityToDelete)}
          isLoading={deleteMutation.isLoading}
          title={getMessage("page.settings.modal.title.delete")}
          labelCancel={getMessage("page.settings.modal.action.delete.cancel")}
          labelConfirm={getMessage("page.settings.modal.action.delete.submit")}
          iconConfirm={<Trash />}
          onConfirm={() => handleDelete(entityToDelete?.id)}
          onClose={handleDeleteDiscard}
        >
          {getMessage({
            id: "page.settings.modal.description.delete",
            props: {
              name: entityToDelete.name,
            },
          })}
        </ConfirmationModal>)}
      </ContentLayout>
    </Main>);
};

export default Settings;
