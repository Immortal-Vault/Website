import { useEffect } from 'react'
import { LOCAL_STORAGE } from '../../shared'
import { useTranslation } from 'react-i18next'
import { Footer, PrimaryHeader } from '../../components'
import { Container, Grid, ScrollArea } from '@mantine/core'
import { Secrets } from './subviews'
import { FaLock } from 'react-icons/fa'
import { useMediaQuery } from '@mantine/hooks'
import { Folders } from './subviews/folders'

export function Primary() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { i18n } = useTranslation('views')

  useEffect(() => {
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }, [])

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
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollArea h={'calc(100vh - 200px)'} type={'always'} scrollbars={'y'}>
              {!isMobile && (
                <FaLock
                  size={'14rem'}
                  style={{
                    marginTop: '100%',
                  }}
                />
              )}
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}
