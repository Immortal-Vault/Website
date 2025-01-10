import { useEffect, useState } from 'react';
import {
  Button,
  ComboboxItem,
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  List,
  Modal,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { TFolder } from '../../../../types';
import { useSecrets } from '../../../../stores';
import { useTranslation } from 'react-i18next';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { v7 as uuid } from 'uuid';
import { sendSuccessNotification } from '../../../../shared';

interface FoldersProps {
  allElementsButtonClick?: () => void;
}

export const Folders = ({ allElementsButtonClick }: FoldersProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { t } = useTranslation('folders');
  const { folders, selectedFolder, secrets, setFolders, saveSecrets, setSelectedFolder } =
    useSecrets();
  const [filteredFolders, setFilteredFolders] = useState<TFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalState, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [deleteModalState, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [folderForDelete, setFolderForDelete] = useState<ComboboxItem | null>(null);

  const addFolderForm = useForm({
    initialValues: {
      label: '',
    },
    validate: {
      label: (val) => (val.length < 1 ? 'fields.label.canNotBeEmpty' : null),
    },
  });

  useEffect(() => {
    handleSearch(searchQuery);
  }, [folders]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFolders(folders);
    } else {
      const filtered = folders.filter((folder) =>
        folder.label.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredFolders(filtered);
    }
  };

  const addFolder = async () => {
    const values = addFolderForm.values;

    if (values.label.length < 1 || secrets === null) {
      return;
    }

    const folder: TFolder = {
      id: uuid(),
      lastUpdated: Date.now(),
      ...values,
    };

    const newFolders = [folder, ...folders];
    setFolders(newFolders);
    setFilteredFolders(newFolders);
    await saveSecrets(secrets ?? [], newFolders);
    sendSuccessNotification(t('notifications:folder.addedSuccessfully'));
  };

  const deleteFolder = async () => {
    if (!folderForDelete || !folderForDelete.value) {
      return;
    }

    const folder = JSON.parse(folderForDelete.value) as TFolder;

    const updatedSecrets = (secrets ?? []).map((secret) => ({
      ...secret,
      folders: secret.folders?.filter((f) => f !== folder.id) ?? [],
    }));

    const newFolders = folders.filter((f) => f.id !== folder.id);

    setFolders(newFolders);
    setFilteredFolders(newFolders);
    await saveSecrets(updatedSecrets, newFolders);
    sendSuccessNotification(t('notifications:folder.deletedSuccessfully'));
  };

  return (
    <>
      <Modal
        centered={true}
        opened={addModalState}
        onClose={closeAddModal}
        size='auto'
        title={t('modals.addFolder.title')}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction={'column'} gap={'md'}>
          <TextInput
            label={t('fields.label.title')}
            value={addFolderForm.values.label}
            onChange={(event) => addFolderForm.setFieldValue('label', event.currentTarget.value)}
            error={addFolderForm.errors.label && t(addFolderForm.errors.label.toString())}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeAddModal();
              addFolderForm.reset();
            }}
          >
            {t('modals.addFolder.buttons.cancel')}
          </Button>
          <Button
            onClick={async () => {
              if (addFolderForm.validate().hasErrors) {
                return;
              }

              closeAddModal();
              await addFolder();
              addFolderForm.reset();
            }}
          >
            {t('modals.addFolder.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Modal
        centered={true}
        opened={deleteModalState}
        onClose={closeDeleteModal}
        size='auto'
        title={t('modals.deleteFolder.title')}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction={'column'} gap={'md'}>
          <Select
            data={folders.map((folder) => ({ value: JSON.stringify(folder), label: folder.label }))}
            value={folderForDelete ? folderForDelete.value : null}
            onChange={(_value, option) => setFolderForDelete(option)}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeDeleteModal();
              setFolderForDelete(null);
            }}
          >
            {t('modals.deleteFolder.buttons.cancel')}
          </Button>
          <Button
            onClick={async () => {
              if (!folderForDelete || !folderForDelete.value) {
                return;
              }

              closeDeleteModal();
              await deleteFolder();
              setFolderForDelete(null);
            }}
          >
            {t('modals.deleteFolder.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Grid grow>
        <Grid.Col span={3} style={{ height: '100%', paddingRight: '20px' }}>
          <Input
            placeholder={t('search.placeholder')}
            mb={'md'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Flex gap={'md'}>
            <Button mb={'md'} fullWidth onClick={openAddModal}>
              {t('buttons.add')}
            </Button>
            <Button mb={'md'} fullWidth onClick={openDeleteModal}>
              {t('buttons.delete')}
            </Button>
          </Flex>
          <Text size='lg' c='gray' mb='md'>
            {t('folders.title')}: {filteredFolders.length}
          </Text>
          <List spacing='md'>
            <List.Item
              key={'allFolders'}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedFolder(null);
              }}
            >
              <Group align='center' justify='space-between'>
                <Text
                  size={isMobile ? 'md' : 'sm'}
                  c={!isMobile && !selectedFolder ? 'blue' : 'white'}
                  onClick={() => allElementsButtonClick && allElementsButtonClick()}
                >
                  {t('allElements')}
                </Text>
              </Group>
            </List.Item>
            <Divider my={'md'} />
            {filteredFolders?.length > 0 ? (
              filteredFolders.map((folder, index) => (
                <>
                  <List.Item
                    key={folder.id}
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedFolder(folder);
                    }}
                  >
                    <Group align='center' justify='space-between'>
                      <Text
                        size={isMobile ? 'md' : 'sm'}
                        c={!isMobile && selectedFolder?.id === folder.id ? 'blue' : 'white'}
                      >
                        {folder.label}
                      </Text>
                    </Group>
                  </List.Item>
                  {index != filteredFolders.length - 1 && <Divider my={'md'} />}
                </>
              ))
            ) : (
              <Text>{t('folders.not_found')}</Text>
            )}
          </List>
        </Grid.Col>
      </Grid>
    </>
  );
};
