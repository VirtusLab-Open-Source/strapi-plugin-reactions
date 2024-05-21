import React, { useState } from "react";

import { isNil } from "lodash";

import {
  Page,
  Layouts,
  useNotification,
  useRBAC,
  useStrapiApp
} from '@strapi/strapi/admin';

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Table,
  Thead,
  Tbody,
  TFooter,
  Tr,
  Th,
  Td,
  Typography,
  VisuallyHidden
} from "@strapi/design-system";

import { Pencil, Plus, Loader, Trash } from "@strapi/icons";

import pluginPermissions from "../../permissions";
import useConfig from "../../hooks/useConfig";
import { getMessage } from "../../utils";
import CUModal from "./components/Modal";
import { ReactionIcon } from "./components/ReactionIcon";
import useUtils from "../../hooks/useUtils";
import ConfirmationModal from "../../components/ConfirmationModal";
import { AdminAction } from "./components/AdminAction";
import { ReactionTypeEntity, StrapiId, ToBeFixed } from "../../../../types";

const DEFAULT_BOX_PROPS = {
  width: "100%",
  background: "neutral0",
  hasRadius: true,
  shadow: "filterShadow",
  padding: 6,
};

const Settings = () => {
  const { toggleNotification } = useNotification();

  const {
    isLoading: isLoadingForPermissions,
    allowedActions,
  } = useRBAC(pluginPermissions);

  const fields = useStrapiApp('ReactionsPluginSettings', (state) => state.fields);

  const { canChange, canAdmin } = allowedActions;

  const [isModalOpened, setModalOpened] = useState(false);
  const [syncAssiciationConfirmationVisible, setSyncAssiciationConfirmationVisible] = useState(false);
  const [modalEntity, setModalEntity] = useState<ReactionTypeEntity | undefined>(undefined);
  const [entityToDelete, setEntityToDelete] = useState<ReactionTypeEntity>();

  const { fetch, submitMutation, deleteMutation } = useConfig(toggleNotification);
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

  const preparePayload = (form: ReactionTypeEntity): ReactionTypeEntity => {
    return form;
  }

  const handleCUD = async (form: ReactionTypeEntity) => {
    if (canChange) {
      // TODO: lockApp();
      try {
        const payload = preparePayload(form);
        await submitMutation.mutateAsync({ body: payload, toggleNotification});
      } finally {
        setModalOpened(false);
        setModalEntity(undefined);
      }
      // TODO: unlockApp();
    }
  };

  const handleDelete = async (id: StrapiId) => {
    if (canChange) {
      // TODO: lockApp();
      try {
        await deleteMutation.mutateAsync({ id, toggleNotification });
      } finally {
        setEntityToDelete(undefined);
      }
      // TODO: unlockApp();
    }
  };

  const handleOpenModal = (entity?: ReactionTypeEntity | undefined) => {
    setModalOpened(true);
    setModalEntity(entity);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setModalEntity(undefined);
  };

  const handleDeleteConfirmation = (entity: ReactionTypeEntity) => {
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
      // TODO: lockApp();
      try {
        await syncAssociationsMutation.mutateAsync();
      } finally {
        setSyncAssiciationConfirmationVisible(false);
      }
      // TODO: unlockApp();
    }
  };

  if (isLoading || isError) {
    return (
      <Page.Loading>
        {getMessage("page.settings.loading")}
      </Page.Loading>
    );
  }

  return (
    <Page.Main>
      <Page.Title>{getMessage("page.settings.header.title")}</Page.Title>
      <Layouts.Header
        title={getMessage("page.settings.header.title")}
        subtitle={getMessage("page.settings.header.description")}
        primaryAction={canChange && (<>
          <Button
            type="submit"
            startIcon={<Plus />}
            onClick={(e: React.FormEvent) => { e.preventDefault(); handleOpenModal(); }}
          >
            {getMessage("page.settings.action.create")}
          </Button>
        </>)}
      />
      <Layouts.Content>
        <Flex direction="column" gap={6}>
          <Box width="100%" hasRadius={false}>
            <Table colCount={5} rowCount={types.length} footer={canChange && (<TFooter
              onClick={(e: React.FormEvent) => { e.preventDefault(); handleOpenModal(); }}
              icon={<Plus />}>
              {getMessage("page.settings.table.action.add")}
            </TFooter>)}>
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
                    {(!entry.icon && entry.emoji) && (<Typography variant="omega">{entry.emoji}</Typography>)}
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
                    { canChange && (<Flex width="100%" justifyContent="flex-end" alignItems="center">
                      <IconButton onClick={() => handleOpenModal(entry)} label={getMessage("page.settings.table.action.edit")} noBorder icon={<Pencil />} />
                      <Box paddingLeft={1}>
                        <IconButton onClick={() => handleDeleteConfirmation(entry)} label={getMessage("page.settings.table.action.delete")} noBorder icon={<Trash />} />
                      </Box>
                    </Flex>)}
                  </Td>
                </Tr>)}
              </Tbody>
            </Table>
          </Box>
          {canAdmin && (
            <Box {...DEFAULT_BOX_PROPS}>
              <Flex width="100%" direction="column" gap={4}>
                <Flex width="100%" direction="column" gap={2} alignItems="flexStart">
                  <Typography variant="delta" tag="h2">
                    {getMessage("page.settings.section.administration-tools")}
                  </Typography>
                  <Typography variant="pi" tag="h4">
                    {getMessage("page.settings.section.administration-tools.subtitle")}
                  </Typography>
                </Flex>
                <Flex width="100%" direction="column" gap={2} alignItems="flexStart">
                  <Divider />
                  <Grid width="100%" gap={4} marginBottom={2}>
                    <GridItem col={12} s={12} xs={12}>
                      <AdminAction
                        title={getMessage("page.settings.action.sync-associations.title")}
                        description={getMessage("page.settings.action.sync-associations.description")}
                        tip={getMessage("page.settings.action.sync-associations.tip")}>
                        <Button
                          variant="danger-light"
                          startIcon={<Loader />}
                          onClick={handleSyncAssociationsConfirmation}
                        >
                          {getMessage("page.settings.action.sync-associations.button")}
                        </Button>

                        <ConfirmationModal
                          isVisible={syncAssiciationConfirmationVisible}
                          isLoading={syncAssociationsMutation.isPending}
                          title={getMessage("page.settings.modal.title.sync-associations")}
                          labelCancel={getMessage("page.settings.modal.action.sync-associations.cancel")}
                          labelConfirm={getMessage("page.settings.modal.action.sync-associations.submit")}
                          iconConfirm={<Loader />}
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
                </Flex>
              </Flex>
            </Box>
          )}
        </Flex>

        {(isModalOpened && canChange) && (<CUModal
          data={modalEntity}
          fields={fields}
          isLoading={submitMutation.isPending}
          onSubmit={handleCUD}
          onClose={handleCloseModal} />)}

        {(entityToDelete && canChange) && (<ConfirmationModal
          isVisible={!isNil(entityToDelete)}
          isLoading={deleteMutation.isPending}
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
      </Layouts.Content>
    </Page.Main>);
};

export default Settings;
