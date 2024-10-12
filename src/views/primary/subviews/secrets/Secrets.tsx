import { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  Drawer,
  FileInput,
  Flex,
  Grid,
  Group,
  Input,
  List,
  Modal,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import {
  TSecret,
  TSecretFile,
  TEnpassField,
  TEnpassItem,
  TEnpassSecretFile,
} from '../../../../types'
import { Secret } from '../../../../components'
import { useAuth, useEnvVars } from '../../../../stores'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { customFetch, uploadSecretFile } from '../../../../api'
import { decrypt, encrypt } from '../../../../shared'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { v7 as uuid } from 'uuid'
import { useForm } from '@mantine/form'
import { FaLock } from 'react-icons/fa'

export const Secrets = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { envs } = useEnvVars()
  const { t } = useTranslation('secrets')
  const authContext = useAuth()
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const [filteredSecrets, setFilteredSecrets] = useState<TSecret[]>([])
  const [selectedSecret, setSelectedSecret] = useState<TSecret | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [addModalState, { open: openAddModal, close: closeAddModal }] = useDisclosure(false)
  const [importModalState, { open: openImportModal, close: closeImportModal }] =
    useDisclosure(false)
  const [importedSecretFile, setImportedSecretFile] = useState<File | null>(null)
  const [drawerState, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)

  const addSecretForm = useForm({
    initialValues: {
      label: '',
      username: '',
      email: '',
      password: '',
      website: '',
      phone: '',
      notes: '',
    },
    validate: {
      label: (val) => (val.length < 1 ? 'fields.label.canNotBeEmpty' : null),
    },
  })

  const fetchSecrets = async () => {
    const notificationId = toast.loading(t('data.fetch.inProgress'))
    try {
      const response = await customFetch(
        `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
        null,
        'GET',
        t,
      )
      const secretFileResponse = await response?.text()
      if (!secretFileResponse) {
        toast.error(t('data.fetch.failed'))
        toast.dismiss(notificationId)
        return
      }

      const decryptedSecretFile = await decrypt(secretFileResponse, authContext.secretPassword)
      const secretFileInfo = JSON.parse(decryptedSecretFile) as TSecretFile
      const secrets = secretFileInfo.secrets
      setSecrets(secrets ?? [])
      setFilteredSecrets(secrets ?? [])

      toast.dismiss(notificationId)
    } catch (error) {
      authContext.openSecretPasswordModel()
      console.error(error)
      toast.error(t('incorrectMasterPassword'))
      toast.dismiss(notificationId)
    }
  }

  const saveSecrets = async (secrets: TSecret[]) => {
    const notificationId = toast.loading(t('data.updating'))

    const secretFile: TSecretFile = {
      version: '0.0.1',
      secrets,
    }
    const result = await uploadSecretFile(
      await encrypt(JSON.stringify(secretFile), authContext.secretPassword),
      envs,
      t,
      authContext,
    )

    if (!result) {
      toast.error(t('data.failed'))
      toast.dismiss(notificationId)
      return
    }

    toast.success(t('data.updated'))
    toast.dismiss(notificationId)
  }

  const addSecret = async () => {
    const values = addSecretForm.values

    if (values.label.length < 1) {
      return
    }

    const secret: TSecret = {
      id: uuid(),
      lastUpdated: Date.now(),
      created: Date.now(),
      ...values,
    }

    const newSecrets = [secret, ...secrets]
    setSecrets(newSecrets)
    setFilteredSecrets(newSecrets)
    await saveSecrets(newSecrets)
  }

  const importSecrets = async () => {
    if (importedSecretFile?.type != 'application/json') {
      return
    }

    const fileContent = JSON.parse(await importedSecretFile?.text()) as TEnpassSecretFile
    const importedSecrets: TSecret[] = []

    fileContent.items.map((item: TEnpassItem) => {
      if (secrets.find((s) => s.id === item.uuid)) {
        return
      }
      const fields = item.fields
      importedSecrets.push({
        id: item.uuid,
        label: item.title,
        username: fields.find((f: TEnpassField) => f.type === 'username')?.value,
        email: fields.find((f: TEnpassField) => f.type === 'email')?.value,
        password: fields.find((f: TEnpassField) => f.type === 'password')?.value,
        website: fields.find((f: TEnpassField) => f.type === 'url')?.value,
        phone: fields.find((f: TEnpassField) => f.type === 'phone')?.value,
        // notes - empty
        lastUpdated: item.updated_at,
        created: item.createdAt,
      })
    })

    if (importedSecrets.length < 1) {
      return
    }

    const newSecrets = [...importedSecrets, ...secrets]
    setSecrets(newSecrets)
    setFilteredSecrets(newSecrets)
    await saveSecrets(newSecrets)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredSecrets(secrets)
    } else {
      const filtered = secrets.filter((secret) =>
        secret.label.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredSecrets(filtered)
    }
  }

  useEffect(() => {
    if (!authContext.secretPassword) {
      authContext.openSecretPasswordModel()
    } else {
      fetchSecrets()
    }
  }, [authContext.secretPassword])

  return (
    <>
      <Modal
        centered={true}
        opened={addModalState}
        onClose={closeAddModal}
        size='auto'
        title={t('modals.addSecret.title')}
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
            value={addSecretForm.values.label}
            onChange={(event) => addSecretForm.setFieldValue('label', event.currentTarget.value)}
            error={addSecretForm.errors.label && t(addSecretForm.errors.label.toString())}
          />
          <TextInput
            label={t('fields.username.title')}
            value={addSecretForm.values.username}
            onChange={(event) => addSecretForm.setFieldValue('username', event.currentTarget.value)}
          />
          <TextInput
            label={t('fields.email.title')}
            value={addSecretForm.values.email}
            onChange={(event) => addSecretForm.setFieldValue('email', event.currentTarget.value)}
          />
          <TextInput
            label={t('fields.password.title')}
            type={'password'}
            value={addSecretForm.values.password}
            onChange={(event) => addSecretForm.setFieldValue('password', event.currentTarget.value)}
          />
          <TextInput
            label={t('fields.website.title')}
            value={addSecretForm.values.website}
            onChange={(event) => addSecretForm.setFieldValue('website', event.currentTarget.value)}
          />
          <TextInput
            label={t('fields.phone.title')}
            type={'phone'}
            value={addSecretForm.values.phone}
            onChange={(event) => addSecretForm.setFieldValue('phone', event.currentTarget.value)}
          />
          <Textarea
            label={t('fields.notes.title')}
            value={addSecretForm.values.notes}
            onChange={(event) => addSecretForm.setFieldValue('notes', event.currentTarget.value)}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeAddModal()
              addSecretForm.reset()
            }}
          >
            {t('modals.addSecret.buttons.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (addSecretForm.validate().hasErrors) {
                return
              }

              addSecret()
              closeAddModal()
              addSecretForm.reset()
            }}
          >
            {t('modals.addSecret.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Modal
        centered={true}
        opened={importModalState}
        onClose={closeImportModal}
        size='auto'
        title={t('modals.importSecrets.title')}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction={'column'} gap={'md'}>
          <FileInput
            label={t('modals.importSecrets.fileInput.label')}
            placeholder={t('modals.importSecrets.fileInput.placeholder')}
            multiple={false}
            value={importedSecretFile}
            onChange={setImportedSecretFile}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeImportModal()
              setImportedSecretFile(null)
            }}
          >
            {t('modals.importSecrets.buttons.cancel')}
          </Button>
          <Button
            onClick={() => {
              importSecrets()
              closeImportModal()
              setImportedSecretFile(null)
            }}
          >
            {t('modals.importSecrets.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Grid grow>
        <Grid.Col span={3} style={{ height: '100%', paddingRight: '20px' }}>
          <Flex gap={'md'}>
            <Button mb={'md'} fullWidth={isMobile} onClick={openAddModal}>
              {t('buttons.add')}
            </Button>
            <Button mb={'md'} fullWidth={isMobile} onClick={openImportModal}>
              {t('buttons.import')}
            </Button>
          </Flex>
          <Input
            placeholder={t('search.placeholder')}
            mb={'md'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Text size='lg' c='gray' mb='md'>
            {t('elements')}
          </Text>
          <List spacing='md'>
            <ScrollArea h={650}>
              {filteredSecrets.map((secret) => (
                <>
                  <List.Item
                    key={secret.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedSecret(secret)
                      openDrawer()
                    }}
                  >
                    <Group align='center' justify='space-between'>
                      <div>
                        <Text size='sm' c='white'>
                          {secret.label}
                        </Text>
                        <Text size='xs' c='gray'>
                          {secret?.username ?? secret?.email ?? ''}
                        </Text>
                      </div>
                    </Group>
                  </List.Item>
                  <Divider my={'md'} />
                </>
              ))}
            </ScrollArea>
          </List>
        </Grid.Col>
        {!isMobile && (
          <Grid.Col span={4}>
            <Flex h={'100%'} justify={'center'} align={'center'}>
              <FaLock size={'25em'} />
            </Flex>
          </Grid.Col>
        )}
      </Grid>
      <Drawer
        opened={drawerState}
        onClose={() => {
          closeDrawer()
          setSelectedSecret(null)
        }}
        position={'right'}
        size={isMobile ? '100%' : 'md'}
      >
        {selectedSecret ? (
          <Secret secret={selectedSecret} />
        ) : (
          <Text c='gray'>{t('unselectedSecretPlaceholder')}</Text>
        )}
      </Drawer>
    </>
  )
}
