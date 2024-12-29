import { useEffect } from 'react'
import { LOCAL_STORAGE } from '../../shared'
import { useTranslation } from 'react-i18next'
import { Footer, PrimaryHeader, Secret } from '../../components'
import { Container, Drawer, Grid, ScrollArea, Text } from '@mantine/core'
import { Secrets } from './subviews'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Folders } from './subviews/folders'
import { useSecrets } from '../../stores'

export function Primary() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { i18n, t } = useTranslation('views')
  const { selectedSecret, selectedFolder, setSelectedSecret, setSelectedFolder, deleteSecret } =
    useSecrets()

  const [foldersDrawerState, { close: closeFoldersDrawer, open: openFoldersDrawer }] =
    useDisclosure(false)
  const [secretsDrawerState, { close: closeSecretsDrawer }] = useDisclosure(false)

  useEffect(() => {
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }, [])

  const getSecretSection = () => (
    <>
      {selectedSecret ? (
        <Secret
          secret={selectedSecret}
          delete={async () => {
            closeFoldersDrawer()
            setSelectedSecret(null)
            await deleteSecret(selectedSecret)
          }}
        />
      ) : (
        <Text c='gray'>{t('secrets:unselectedSecretPlaceholder')}</Text>
      )}
    </>
  )

  const getMobileLayout = () => (
    <>
      <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
        <Folders
          allElementsButtonClick={() => {
            openFoldersDrawer()
          }}
        />
      </ScrollArea>
      <Drawer
        opened={!!selectedFolder || foldersDrawerState}
        onClose={() => {
          closeFoldersDrawer()
          setSelectedSecret(null)
          setSelectedFolder(null)
        }}
        position='bottom'
        size='100%'
      >
        <Secrets />
      </Drawer>
      <Drawer
        opened={!!selectedSecret || secretsDrawerState}
        onClose={() => {
          closeSecretsDrawer()
          setSelectedSecret(null)
          setSelectedFolder(null)
        }}
        position='bottom'
        size='100%'
      >
        {getSecretSection()}
      </Drawer>
    </>
  )

  const getPCLayout = () => (
    <Grid>
      <Grid.Col
        span={2}
        style={{
          borderRight: '1px solid #424242',
        }}
      >
        <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
          <Folders />
        </ScrollArea>
      </Grid.Col>
      <Grid.Col
        span={3}
        style={{
          borderRight: '1px solid #424242',
        }}
      >
        <div
          style={{
            marginLeft: '10px',
          }}
        >
          <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
            <Secrets />
          </ScrollArea>
        </div>
      </Grid.Col>
      <Grid.Col
        span={7}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            marginLeft: '10px',
          }}
        >
          {getSecretSection()}
        </div>
      </Grid.Col>
    </Grid>
  )

  return (
    <>
      <PrimaryHeader />
      <Container fluid mb='xl'>
        {isMobile ? getMobileLayout() : getPCLayout()}
      </Container>
      <Footer />
    </>
  )
}
