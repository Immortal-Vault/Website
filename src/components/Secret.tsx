import {
  Anchor,
  Button,
  CopyButton,
  Flex,
  Group,
  Modal,
  Text,
  Title,
  Card,
  MultiSelect,
  Tooltip,
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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useSecrets } from '../stores';
import { useTranslation } from 'react-i18next';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { trimText } from '../shared';

export const Secret = (props: { secret: TSecret; delete: () => Promise<void> }) => {
  const { folders, secrets, saveSecrets } = useSecrets();
  const { t } = useTranslation('secrets');

  const [showPassword, setShowPassword] = useState(false);
  const [loginTooltipState, setLoginTooltipState] = useState(false);
  const [emailTooltipState, setEmailTooltipState] = useState(false);
  const [passwordTooltipState, setPasswordTooltipState] = useState(false);
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false);

  const [attachedFolders, setAttachedFolders] = useState<string[]>([]);

  useEffect(() => {
    const secretFolders = props.secret.folders ? props.secret.folders : [];
    setAttachedFolders(folders.filter((f) => secretFolders.includes(f.id)).map((f) => f.id));
  }, [folders, props.secret.folders]);

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setShowPassword(false);
  }, []);

  const handleFoldersChange = async (folderIds: string[]) => {
    if (!secrets) {
      return;
    }
    const secret = secrets.find((secret) => secret.id === props.secret.id);
    if (!secret) {
      return;
    }

    setAttachedFolders(folderIds);
    secret.folders = folderIds;
    secret.lastUpdated = Date.now();

    await saveSecrets(secrets, folders);
  };

  function renderLoginCopyButton(copied: boolean, copy: () => void) {
    setLoginTooltipState(copied);

    return (
      <Tooltip label={t('buttons.copied')} opened={loginTooltipState}>
        <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
          <FaCopy size={18} />
        </Button>
      </Tooltip>
    );
  }

  function renderEmailCopyButton(copied: boolean, copy: () => void) {
    setEmailTooltipState(copied);

    return (
      <Tooltip label={t('buttons.copied')} opened={emailTooltipState}>
        <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
          <FaCopy size={18} />
        </Button>
      </Tooltip>
    );
  }

  function renderPasswordCopyButton(copied: boolean, copy: () => void) {
    setPasswordTooltipState(copied);

    return (
      <Tooltip label={t('buttons.copied')} opened={passwordTooltipState}>
        <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
          <FaCopy size={18} />
        </Button>
      </Tooltip>
    );
  }

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
        <Group align='center' mb='xl'>
          <FaAddressCard size={24} />
          <Title order={3} c='white' style={{ wordBreak: 'break-word' }}>
            {props.secret.label}
          </Title>
        </Group>

        <Flex direction='column' gap='sm' mb='lg'>
          {props.secret.username && (
            <Group>
              <FaUserAlt size={18} />
              <Text c='gray'>{t('fields.username.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {trimText(props.secret.username, 30)}
              </Text>

              <CopyButton value={props.secret.username}>
                {({ copied, copy }) => renderLoginCopyButton(copied, copy)}
              </CopyButton>
            </Group>
          )}
          {props.secret.email && (
            <Group>
              <MdOutlineAlternateEmail size={18} />
              <Text c='gray'>{t('fields.email.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {trimText(props.secret.email, 30)}
              </Text>

              <CopyButton value={props.secret.email}>
                {({ copied, copy }) => renderEmailCopyButton(copied, copy)}
              </CopyButton>
            </Group>
          )}
          {props.secret.password && (
            <Group>
              <FaLock size={18} />
              <Text c='gray'>{t('fields.password.title')}:</Text>

              <Button size='xs' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
              </Button>
              <CopyButton value={props.secret.password}>
                {({ copied, copy }) => renderPasswordCopyButton(copied, copy)}
              </CopyButton>

              <Text c='white' style={{ wordBreak: 'break-all' }}>
                {showPassword ? props.secret.password : '••••••••'}
              </Text>
            </Group>
          )}
          {props.secret.website && (
            <Group>
              <FaExternalLinkAlt size={18} />
              <Text c='gray'>{t('fields.website.title')}:</Text>
              <Anchor
                href={
                  props.secret.website.startsWith('http')
                    ? props.secret.website
                    : `https://${props.secret.website}`
                }
                target='_blank'
                underline='always'
                style={{ wordBreak: 'break-word' }}
              >
                {props.secret.website}
              </Anchor>
            </Group>
          )}
          {props.secret.phone && (
            <Group>
              <FaPhoneAlt size={18} />
              <Text c='gray'>{t('fields.phone.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.phone}
              </Text>
            </Group>
          )}
          {props.secret.notes && (
            <Group>
              <FaStickyNote size={18} />
              <Text c='gray'>{t('fields.notes.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.notes}
              </Text>
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

        <Flex direction='column' gap='sm'>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.lastUpdated.title')}: {new Date(props.secret.lastUpdated).toLocaleString()}
            </Text>
          </Group>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              {t('fields.created.title')}: {new Date(props.secret.created).toLocaleString()}
            </Text>
          </Group>
        </Flex>

        <Group mt='lg'>
          <Button color='red' onClick={openSubmitModal}>
            {t('buttons.delete')}
          </Button>
        </Group>
      </Card>
    </>
  );
};
