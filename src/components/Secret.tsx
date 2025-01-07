import {
  Anchor,
  Button,
  Card,
  CopyButton,
  Flex,
  Group,
  Modal,
  MultiSelect,
  PasswordInput,
  Text,
  Textarea,
  TextInput,
  Title,
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
import { useEffect, useState } from 'react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useSecrets } from '../stores';
import { useTranslation } from 'react-i18next';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { trimText } from '../shared';

export const Secret = (props: { sourceSecret: TSecret; delete: () => Promise<void> }) => {
  const { folders, secrets, saveSecrets } = useSecrets();
  const { t } = useTranslation('secrets');

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [secret, setSecret] = useState<TSecret | null>(null);
  const [editedSecret, setEditedSecret] = useState<TSecret | null>(null);
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false);

  const [attachedFolders, setAttachedFolders] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setSecret(props.sourceSecret);
    setEditedSecret(props.sourceSecret);
    setShowPassword(false);
  }, [props.sourceSecret]);

  useEffect(() => {
    const secretFolders = secret?.folders ? secret.folders : [];
    setAttachedFolders(folders.filter((f) => secretFolders.includes(f.id)).map((f) => f.id));
  }, [folders, secret]);

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

  const handleFoldersChange = async (folderIds: string[]) => {
    const foundSecret = secrets.find((s) => s.id === secret?.id);
    if (!foundSecret) {
      return;
    }

    setAttachedFolders(folderIds);
    foundSecret.folders = folderIds;
    foundSecret.lastUpdated = Date.now();
    await saveSecrets(secrets, folders);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedSecret(secret);
  };

  const handleSave = async () => {
    if (!editedSecret || !secret) {
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
      <CopyButton value={copy}>
        {({ copied, copy }) => (
          <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
            <FaCopy size={18} />
          </Button>
        )}
      </CopyButton>
    );
  };

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
      </Flex>
    </>
  );

  const getLayout = () => (
    <>
      <Group align='center' mb='xl'>
        <FaAddressCard size={24} />
        <Title order={3} c='white' style={{ wordBreak: 'break-word' }}>
          {secret?.label}
        </Title>
      </Group>

      <Flex direction='column' gap='sm' mb='lg'>
        {secret?.username && (
          <Group>
            <FaUserAlt size={18} />
            <Text c='gray'>{t('fields.username.title')}:</Text>
            <Text c='white' style={{ wordBreak: 'break-word' }}>
              {trimText(secret.username, 30)}
            </Text>
            {getCopyButton(secret.username)}
          </Group>
        )}
        {secret?.email && (
          <Group>
            <MdOutlineAlternateEmail size={18} />
            <Text c='gray'>{t('fields.email.title')}:</Text>
            <Text c='white' style={{ wordBreak: 'break-word' }}>
              {trimText(secret.email, 30)}
            </Text>
            {getCopyButton(secret.email)}
          </Group>
        )}
        {secret?.password && (
          <Group>
            <FaLock size={18} />
            <Text c='gray'>{t('fields.password.title')}:</Text>

            <Text c='white' style={{ wordBreak: 'break-all' }}>
              {showPassword ? secret.password : '••••••••'}
            </Text>
            <Button size='xs' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
            </Button>
            {getCopyButton(secret.password)}
          </Group>
        )}
        {secret?.website && (
          <Group>
            <FaExternalLinkAlt size={18} />
            <Text c='gray'>{t('fields.website.title')}:</Text>
            <Anchor
              href={
                secret.website.startsWith('http') ? secret.website : `https://${secret.website}`
              }
              target='_blank'
              underline='always'
              style={{ wordBreak: 'break-word' }}
            >
              {secret.website}
            </Anchor>
            {getCopyButton(secret.website)}
          </Group>
        )}
        {secret?.phone && (
          <Group>
            <FaPhoneAlt size={18} />
            <Text c='gray'>{t('fields.phone.title')}:</Text>
            <Text c='white' style={{ wordBreak: 'break-word' }}>
              {secret.phone}
            </Text>
            {getCopyButton(secret.phone)}
          </Group>
        )}
        {secret?.notes && (
          <Group>
            <FaStickyNote size={18} />
            <Text c='gray'>{t('fields.notes.title')}:</Text>
            <Text c='white' style={{ wordBreak: 'break-word' }}>
              {secret.notes}
            </Text>
            {getCopyButton(secret.notes)}
          </Group>
        )}

        <Group>
          <FaFolder />
          <Text c='gray'>{t('fields.folders.title')}:</Text>
        </Group>
        <Group>
          <MultiSelect
            data={folders.map((folder) => ({ value: folder.id, label: folder.label }))}
            value={attachedFolders}
            onChange={handleFoldersChange}
            placeholder={t('fields.folders.select.placeholder')}
            clearable
          />
        </Group>
      </Flex>

      {secret && (
        <Flex direction='column' gap='sm'>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.lastUpdated.title')}: {new Date(secret.lastUpdated).toLocaleString()}
            </Text>
          </Group>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.created.title')}: {new Date(secret.created).toLocaleString()}
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

      <Card shadow='md' radius='md' padding='lg' withBorder w={!isMobile ? '90%' : '100%'}>
        {isEditing ? getEditorLayout() : getLayout()}

        <Group mt='lg'>{isEditing ? getEditorButtonsLayout() : getButtonsLayout()}</Group>
      </Card>
    </>
  );
};
