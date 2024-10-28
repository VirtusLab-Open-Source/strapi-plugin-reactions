import React, { useState } from "react";

import { Data } from "@strapi/strapi";

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
  IconButton,
  IconButtonGroup,
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

import { Pencil, Plus, Trash, ArrowClockwise } from "@strapi/icons";
import { ConfirmationDialog } from "@sensinum/strapi-utils";

import pluginPermissions from "../../permissions";
import useConfig from "../../hooks/useConfig";
import { getMessage } from "../../utils";
import CUModal from "./components/Modal";
import { ReactionIcon } from "./components/ReactionIcon";
import useUtils from "../../hooks/useUtils";
import { AdminAction } from "./components/AdminAction";
import { CTReactionType, ToBeFixed } from "../../../../@types";

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
  const [modalEntity, setModalEntity] = useState<CTReactionType | undefined>(undefined);
  const [entityToDelete, setEntityToDelete] = useState<CTReactionType>();

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

  const preparePayload = (form: CTReactionType): CTReactionType => {
    return form;
  }

  const handleCUD = async (form: CTReactionType) => {
    if (canChange) {
      try {
        const payload = preparePayload(form);
        await submitMutation.mutateAsync({ body: payload, toggleNotification });
        setModalOpened(false);
        setModalEntity(undefined);
      } catch(e: any) {
        console.error(e);
      }
    }
  };

  const handleDelete = async (documentId: Data.DocumentID) => {
    if (canChange) {
      try {
        await deleteMutation.mutateAsync({ documentId, toggleNotification });
      } finally {
        setEntityToDelete(undefined);
      }
    }
  };

  const handleOpenModal = (entity?: CTReactionType | undefined) => {
    setModalOpened(true);
    setModalEntity(entity);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setModalEntity(undefined);
  };

  const handleDeleteConfirmation = (entity: CTReactionType) => {
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
      try {
        await syncAssociationsMutation.mutateAsync();
      } finally {
        setSyncAssiciationConfirmationVisible(false);
      }
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
                {types.map((entry: ToBeFixed) => <Tr key={entry.documentId}>
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
                    {canChange && (<Flex width="100%" justifyContent="flex-end" alignItems="center">
                      <IconButtonGroup>
                        <IconButton onClick={() => handleOpenModal(entry)} label={getMessage("page.settings.table.action.edit")} noBorder>
                          <Pencil />
                        </IconButton>
                        {( canChange) && (<ConfirmationDialog
                            isVisible={entityToDelete?.documentId === entry.documentId}
                            isLoading={deleteMutation.isPending}
                            title={getMessage("page.settings.modal.title.delete")}
                            labelCancel={getMessage("page.settings.modal.action.delete.cancel")}
                            labelConfirm={getMessage("page.settings.modal.action.delete.submit")}
                            iconConfirm={<Trash />}
                            onConfirm={() => handleDelete(entityToDelete?.documentId)}
                            onClose={handleDeleteDiscard}
                            trigger={<IconButton variant="danger-light" onClick={() => handleDeleteConfirmation(entry)} label={getMessage("page.settings.table.action.delete")} noBorder>
                              <Trash />
                            </IconButton>}
                          >
                            {getMessage({
                              id: "page.settings.modal.description.delete",
                              props: {
                                name: entityToDelete?.name,
                              },
                            })}
                          </ConfirmationDialog>)}
                      </IconButtonGroup>
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
                    {getMessage("page.settings.section.administrationTools.title")}
                  </Typography>
                  <Typography variant="pi" tag="h4">
                    {getMessage("page.settings.section.administrationTools.subtitle")}
                  </Typography>
                </Flex>
                <Flex width="100%" direction="column" gap={2} alignItems="flexStart">
                  <Divider />
                  <Grid.Root width="100%" gap={4} marginBottom={2}>
                    <Grid.Item col={12} s={12} xs={12}>
                      <AdminAction
                        title={getMessage("page.settings.action.syncAssociations.title")}
                        description={getMessage("page.settings.action.syncAssociations.description")}
                        tip={getMessage("page.settings.action.syncAssociations.tip")}>
                        <ConfirmationDialog
                          isVisible={syncAssiciationConfirmationVisible}
                          isLoading={syncAssociationsMutation.isPending}
                          title={getMessage("page.settings.modal.title.syncAssociations")}
                          labelCancel={getMessage("page.settings.modal.action.syncAssociations.cancel")}
                          labelConfirm={getMessage("page.settings.modal.action.syncAssociations.submit")}
                          iconConfirm={<ArrowClockwise />}
                          onConfirm={handleSyncAssociations}
                          onClose={handleSyncAssociationsCancel}
                          trigger={<Button
                            variant="danger-light"
                            startIcon={<ArrowClockwise />}
                            onClick={handleSyncAssociationsConfirmation}
                          >
                            {getMessage("page.settings.action.syncAssociations.button")}
                          </Button>}
                        >
                          {getMessage(
                            "page.settings.modal.description.syncAssociations"
                          )}
                        </ConfirmationDialog>
                      </AdminAction>
                    </Grid.Item>
                  </Grid.Root>
                </Flex>
              </Flex>
            </Box>
          )}
        </Flex>

        {(isModalOpened && canChange) && (<CUModal
          isModalOpened={isModalOpened}
          data={modalEntity}
          fields={fields}
          isLoading={submitMutation.isPending}
          onSubmit={handleCUD}
          onClose={handleCloseModal} />)}
      </Layouts.Content>
    </Page.Main>);
};

export default Settings;
