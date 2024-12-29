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
} from '@mantine/core'
import {
  FaAddressCard,
  FaClock,
  FaExternalLinkAlt,
  FaFolder,
  FaLock,
  FaPhoneAlt,
  FaStickyNote,
  FaUserAlt,
} from 'react-icons/fa'
import { TSecret } from '../types'
import { useEffect, useState } from 'react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useSecrets } from '../stores'
import { useTranslation } from 'react-i18next'

export const Secret = (props: { secret: TSecret; delete: () => Promise<void> }) => {
  const { folders, secrets, saveSecrets } = useSecrets()
  const { t } = useTranslation('secrets')

  const [showPassword, setShowPassword] = useState(false)
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false)

  const [attachedFolders, setAttachedFolders] = useState<string[]>([])

  useEffect(() => {
    setAttachedFolders(folders.filter((f) => props.secret.folders.includes(f.id)).map((f) => f.id))
  }, [folders, props.secret.folders])

  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    setShowPassword(false)
  }, [])

  const handleFoldersChange = async (folderIds: string[]) => {
    const secret = secrets.find((secret) => secret.id === props.secret.id)
    if (!secret) {
      return
    }

    setAttachedFolders(folderIds)
    secret.folders = folderIds
    secret.lastUpdated = Date.now()

    await saveSecrets(secrets, folders)
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
          <Button variant='outline' onClick={closeSubmitModal}>
            {t('modals.submitDelete.buttons.cancel')}
          </Button>
          <Button
            color='red'
            onClick={async () => {
              await props.delete()
              closeSubmitModal()
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
                {props.secret.username}
              </Text>
            </Group>
          )}
          {props.secret.email && (
            <Group>
              <FaUserAlt size={18} />
              <Text c='gray'>{t('fields.email.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.email}
              </Text>
            </Group>
          )}
          {props.secret.password && (
            <Group>
              <FaLock size={18} />
              <Text c='gray'>{t('fields.password.title')}:</Text>
              <Text c='white' style={{ wordBreak: 'break-all' }}>
                {showPassword
                  ? props.secret.password
                  : Array.from({ length: props.secret.password.length }).map(() => '•')}
              </Text>
            </Group>
          )}
          {props.secret.password && (
            <Group>
              <Button size='xs' variant='outline' onClick={() => setShowPassword(!showPassword)}>
                {t(showPassword ? 'buttons.hide' : 'buttons.show')}
              </Button>
              <CopyButton value={props.secret.password}>
                {({ copied, copy }) => (
                  <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
                    {t(copied ? 'buttons.copied' : 'buttons.copy')}
                  </Button>
                )}
              </CopyButton>
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
  )
}
