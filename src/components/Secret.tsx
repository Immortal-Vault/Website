import {
  Button,
  CopyButton,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  PasswordInput,
  Pill,
  Text,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  FaAddressCard,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaFolder,
  FaLock,
  FaPhoneAlt,
  FaRegEye,
  FaRegEyeSlash,
  FaStickyNote,
  FaUserAlt,
} from 'react-icons/fa';
import { TSecret } from '../types';
import { ReactNode, useEffect, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useAuth, useSecrets } from '../stores';
import { useTranslation } from 'react-i18next';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { getDateTimeFormatOptions, sendSuccessNotification, trimText } from '../shared';

export const Secret = (props: { sourceSecret: TSecret; delete: () => Promise<void> }) => {
  const { folders, secrets, saveSecrets, setSelectedFolder } = useSecrets();
  const { t, i18n } = useTranslation('secrets');
  const { is12HoursFormat } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [secret, setSecret] = useState<TSecret | null>(null);
  const [editedSecret, setEditedSecret] = useState<TSecret | null>(null);
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false);

  const dateTimeFormatOptions = getDateTimeFormatOptions(i18n.language, is12HoursFormat);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setSecret(props.sourceSecret);
    setEditedSecret(props.sourceSecret);
    setShowPassword(false);
  }, [props.sourceSecret]);

  useEffect(() => {
    if (!secret) {
      return;
    }

    if (secret.id !== props.sourceSecret.id) {
      setIsEditing(false);
    }
  }, [secret, props.sourceSecret]);

  useEffect(() => {
    setShowPassword(false);
  }, [isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedSecret(secret);
  };

  const handleSave = async () => {
    if (!editedSecret || !secret || !secrets) {
      return;
    }

    const secretIndex = secrets.findIndex((s) => s.id === secret.id);
    if (secretIndex !== -1) {
      secrets[secretIndex] = { ...editedSecret, lastUpdated: Date.now() };
      setSecret(editedSecret);
      saveSecrets(secrets, folders);
    }
    setIsEditing(false);
  };

  const getCopyButton = (copy: string) => {
    return (
      <CopyButton value={copy} timeout={500}>
        {({ copied, copy }) => (
          <UnstyledButton
            size='xs'
            onClick={() => {
              copy();
              sendSuccessNotification(t('notifications:copied'));
            }}
          >
            <FaCopy size={18} color={copied ? '#3fa2ed' : 'gray'} />
          </UnstyledButton>
        )}
      </CopyButton>
    );
  };

  const renderField = (
    icon: ReactNode,
    label: string,
    value: string,
    copyable = false,
    isPassword = false,
  ) => (
    <Grid align='center' mb='xs'>
      <Grid.Col span={isMobile ? 6 : 2.25}>
        <Group>
          {icon}
          <Text c='gray'>{label}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={isMobile ? 4 : 3}>
        <Flex align='center' gap='sm'>
          <Text c='white' style={{ wordBreak: 'break-word' }}>
            {isPassword && !showPassword ? '••••••••' : trimText(value, 80)}
          </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={1}>
        <Flex direction={'row'} gap={'sm'}>
          {copyable && getCopyButton(value)}
          {isPassword && (
            <UnstyledButton size='xs' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaRegEyeSlash size={22} color={'gray'} />
              ) : (
                <FaRegEye size={22} color={'gray'} />
              )}
            </UnstyledButton>
          )}
        </Flex>
      </Grid.Col>
    </Grid>
  );

  const getEditorLayout = () => (
    <>
      <Flex direction={'column'} gap={'md'}>
        <Group>
          <FaAddressCard size={18} />
          <Text c='gray'>{t('fields.label.title')}:</Text>
          <TextInput
            w={'22rem'}
            value={editedSecret?.label || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, label: e.target.value })
            }
          />
        </Group>
        <Group>
          <FaUserAlt size={18} />
          <Text c='gray'>{t('fields.username.title')}:</Text>
          <TextInput
            w={'18rem'}
            value={editedSecret?.username || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, username: e.target.value })
            }
          />
        </Group>
        <Group>
          <MdOutlineAlternateEmail size={18} />
          <Text c='gray'>{t('fields.email.title')}:</Text>
          <TextInput
            w={'17.6rem'}
            value={editedSecret?.email || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, email: e.target.value })
            }
          />
        </Group>
        <Group>
          <FaLock size={18} />
          <Text c='gray'>{t('fields.password.title')}:</Text>

          <PasswordInput
            w={'23rem'}
            value={editedSecret?.password || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, password: e.target.value })
            }
          />
        </Group>
        <Group>
          <FaExternalLinkAlt size={18} />
          <Text c='gray'>{t('fields.website.title')}:</Text>
          <TextInput
            w={'22.5rem'}
            value={editedSecret?.website || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, website: e.target.value })
            }
          />
        </Group>
        <Group>
          <FaPhoneAlt size={18} />
          <Text c='gray'>{t('fields.phone.title')}:</Text>
          <TextInput
            w={'22.7rem'}
            value={editedSecret?.phone || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, phone: e.target.value })
            }
          />
        </Group>
        <Group>
          <FaStickyNote size={18} />
          <Text c='gray'>{t('fields.notes.title')}:</Text>
          <Textarea
            w={'22.8rem'}
            value={editedSecret?.notes || ''}
            onChange={(e) =>
              editedSecret && setEditedSecret({ ...editedSecret, notes: e.target.value })
            }
          />
        </Group>

        <Group>
          <FaFolder />
          <Text c='gray'>{t('fields.folders.title')}:</Text>

          <MultiSelect
            w={'22.8rem'}
            data={folders.map((folder) => ({ value: folder.id, label: folder.label }))}
            value={editedSecret?.folders ?? []}
            onChange={(folderIds) =>
              editedSecret && setEditedSecret({ ...editedSecret, folders: folderIds })
            }
            clearable
          />
        </Group>
      </Flex>
    </>
  );

  const getLayout = () => (
    <>
      <Group align='center' mb='md'>
        <FaAddressCard size={24} />
        <Title order={3} c='white' style={{ wordBreak: 'break-word' }}>
          {secret?.label}
        </Title>
      </Group>

      <Divider mb='md' />

      <Flex direction='column' gap='sm' mb='lg'>
        {secret?.username &&
          renderField(<FaUserAlt size={18} />, t('fields.username.title'), secret.username, true)}
        {secret?.email &&
          renderField(
            <MdOutlineAlternateEmail size={18} />,
            t('fields.email.title'),
            secret.email,
            true,
          )}
        {secret?.password &&
          renderField(
            <FaLock size={18} />,
            t('fields.password.title'),
            secret.password,
            true,
            true,
          )}
        {secret?.website &&
          renderField(
            <FaExternalLinkAlt size={18} />,
            t('fields.website.title'),
            secret.website,
            true,
          )}
        {secret?.phone &&
          renderField(<FaPhoneAlt size={18} />, t('fields.phone.title'), secret.phone, true)}
        {secret?.notes &&
          renderField(<FaStickyNote size={18} />, t('fields.notes.title'), secret.notes, true)}

        {secret && secret.folders.length > 0 && (
          <Grid align='center' mb='xs'>
            <Grid.Col span={2.25}>
              <Group>
                <FaFolder />
                <Text c='gray'>{t('fields.folders.title')}</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={5}>
              <Group gap={'sm'}>
                {secret.folders.map((folderId) => {
                  const f = folders.find((folder) => folder.id === folderId);
                  return f ? (
                    <Pill
                      key={f.id}
                      size='lg'
                      radius='lg'
                      bg='gray'
                      onClick={() => setSelectedFolder(f)}
                    >
                      {f.label}
                    </Pill>
                  ) : (
                    []
                  );
                })}
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </Flex>

      {secret && (
        <Flex direction='column' gap='sm'>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.lastUpdated.title')}: {dateTimeFormatOptions.format(secret.lastUpdated)}
            </Text>
          </Group>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.created.title')}: {dateTimeFormatOptions.format(secret.created)}
            </Text>
          </Group>
        </Flex>
      )}
    </>
  );

  const getEditorButtonsLayout = () => (
    <>
      <Button color={'green'} onClick={handleSave}>
        {t('buttons.save')}
      </Button>
      <Button variant={'outline'} onClick={handleEditToggle}>
        {t('buttons.cancel')}
      </Button>
    </>
  );

  const getButtonsLayout = () => (
    <>
      <Button onClick={handleEditToggle}>{t('buttons.edit')}</Button>
      <Button color='red' onClick={openSubmitModal}>
        {t('buttons.delete')}
      </Button>
    </>
  );

  return (
    <>
      <Modal
        centered
        opened={submitModalState}
        onClose={closeSubmitModal}
        size='sm'
        title={t('modals.submitDelete.title')}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Group mt='lg'>
          <Button variant='filled' onClick={closeSubmitModal}>
            {t('modals.submitDelete.buttons.cancel')}
          </Button>
          <Button
            color='red'
            variant={'outline'}
            onClick={async () => {
              await props.delete();
              closeSubmitModal();
            }}
          >
            {t('modals.submitDelete.buttons.delete')}
          </Button>
        </Group>
      </Modal>

      {isEditing ? getEditorLayout() : getLayout()}

      <Group mt='lg'>{isEditing ? getEditorButtonsLayout() : getButtonsLayout()}</Group>
    </>
  );
};
