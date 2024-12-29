import { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  FileInput,
  Flex,
  Grid,
  Group,
  Input,
  List,
  Modal,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import {
  TEnpassField,
  TEnpassFolder,
  TEnpassItem,
  TEnpassSecretFile,
  TFolder,
  TSecret,
} from '../../../../types'
import { useSecrets } from '../../../../stores'
import { useTranslation } from 'react-i18next'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { v7 as uuid } from 'uuid'
import { useForm } from '@mantine/form'
import { trimText } from '../../../../shared'

export const Secrets = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { t } = useTranslation('secrets')
  const {
    secrets,
    filteredSecrets,
    selectedSecret,
    folders,
    selectedFolder,
    setSecrets,
    setFolders,
    saveSecrets,
    setSelectedSecret,
    setFilteredSecrets,
  } = useSecrets()
  const [searchQuery, setSearchQuery] = useState('')
  const [addModalState, { open: openAddModal, close: closeAddModal }] = useDisclosure(false)
  const [importModalState, { open: openImportModal, close: closeImportModal }] =
    useDisclosure(false)
  const [importedSecretFile, setImportedSecretFile] = useState<File | null>(null)

  const secretsToRender = selectedFolder
    ? filteredSecrets.filter((s) => s.folders.includes(selectedFolder.id))
    : filteredSecrets

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

  useEffect(() => {
    handleSearch(searchQuery)
  }, [secrets])

  const addSecret = async () => {
    const values = addSecretForm.values

    if (values.label.length < 1) {
      return
    }

    const secret: TSecret = {
      id: uuid(),
      folders: [],
      lastUpdated: Date.now(),
      created: Date.now(),
      ...values,
    }

    const newSecrets = [secret, ...secrets]
    setSecrets(newSecrets)
    setFilteredSecrets(newSecrets)
    await saveSecrets(newSecrets, folders)
  }

  const importSecrets = async () => {
    if (importedSecretFile?.type != 'application/json') {
      return
    }

    const fileContent = JSON.parse(await importedSecretFile?.text()) as TEnpassSecretFile
    const importedSecrets: TSecret[] = []
    const importedFolders: TFolder[] = []

    fileContent.items.map((item: TEnpassItem) => {
      if (secrets.find((s) => s.id === item.uuid)) {
        return
      }

      const fields = item.fields
      importedSecrets.push({
        id: item.uuid,
        folders: item.folders,
        label: item.title,
        username: fields.find((f: TEnpassField) => f.type === 'username')?.value,
        email: fields.find((f: TEnpassField) => f.type === 'email')?.value,
        password: fields.find((f: TEnpassField) => f.type === 'password')?.value,
        website: fields.find((f: TEnpassField) => f.type === 'url')?.value,
        phone: fields.find((f: TEnpassField) => f.type === 'phone')?.value,
        notes: item.note,
        lastUpdated: item.updated_at * 1000,
        created: item.createdAt * 1000,
      })
    })

    fileContent.folders.map((folder: TEnpassFolder) => {
      if (folders.find((f) => f.id === folder.uuid)) {
        return
      }

      importedFolders.push({
        id: folder.uuid,
        label: folder.title,
        lastUpdated: folder.updated_at * 1000,
      })
    })

    if (importedSecrets.length < 1) {
      return
    }

    const newSecrets = [...importedSecrets, ...secrets]
    setSecrets(newSecrets)
    setFilteredSecrets(newSecrets)

    const newFolders = [...importedFolders, ...folders]
    setFolders(newFolders)

    await saveSecrets(newSecrets, newFolders)
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
            type={'email'}
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
          <Input
            placeholder={t('search.placeholder')}
            mb={'md'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Flex gap={'md'}>
            <Button mb={'md'} fullWidth={isMobile} onClick={openAddModal}>
              {t('buttons.add')}
            </Button>
            <Button mb={'md'} fullWidth={isMobile} onClick={openImportModal}>
              {t('buttons.import')}
            </Button>
          </Flex>
          <Text size='lg' c='gray' mb='md'>
            {t('elements')}
          </Text>
          <List spacing='md'>
            {secretsToRender.map((secret, index) => (
              <>
                <List.Item
                  key={secret.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedSecret(secret)
                  }}
                >
                  <Group align='center' justify='space-between'>
                    <div>
                      <Text size='sm' c={selectedSecret?.id === secret.id ? 'blue' : 'white'}>
                        {trimText(secret.label, 60)}
                      </Text>
                      <Text size='xs' c={selectedSecret?.id === secret.id ? 'blue' : 'gray'}>
                        {trimText(secret?.username ?? secret?.email ?? '', 70)}
                      </Text>
                    </div>
                  </Group>
                </List.Item>
                {index != secretsToRender.length - 1 && <Divider my={'md'} />}
              </>
            ))}
          </List>
        </Grid.Col>
      </Grid>
    </>
  )
}
