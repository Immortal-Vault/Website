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
  const { selectedSecret, setSelectedSecret, deleteSecret } = useSecrets()

  const [drawerState, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)

  useEffect(() => {
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }, [])

  const getSecretSection = () => {
    return (
      <>
        {selectedSecret ? (
          <Secret
            secret={selectedSecret}
            delete={async () => {
              closeDrawer()
              setSelectedSecret(null)
              await deleteSecret(selectedSecret)
            }}
          ></Secret>
        ) : (
          <Text c='gray'>{t('secrets:unselectedSecretPlaceholder')}</Text>
        )}
      </>
    )
  }

  return (
    <>
      <PrimaryHeader />
      <Container fluid mb={'xl'}>
        <Grid>
          <Grid.Col span={2}>
            <ScrollArea h={'calc(100vh - 200px)'} type={'always'} scrollbars={'y'} offsetScrollbars>
              <Folders />
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={3}>
            <ScrollArea h={'calc(100vh - 200px)'} type={'always'} scrollbars={'y'} offsetScrollbars>
              <Secrets />
            </ScrollArea>
          </Grid.Col>

          <Grid.Col
            span={7}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {getSecretSection()}
            <Drawer
              opened={drawerState}
              onClose={() => {
                closeDrawer()
                setSelectedSecret(null)
              }}
              position={'right'}
              size={isMobile ? '100%' : 'xl'}
            >
              {getSecretSection()}
            </Drawer>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}
