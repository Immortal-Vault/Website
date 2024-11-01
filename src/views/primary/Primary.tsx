import { useEffect } from 'react'
import { LOCAL_STORAGE } from '../../shared'
import { useTranslation } from 'react-i18next'
import { Footer, PrimaryHeader } from '../../components'
import { Container, Grid, ScrollArea, Text, Title } from '@mantine/core'
import { Secrets } from './subviews'
import { FaLock } from 'react-icons/fa'
import { useMediaQuery } from '@mantine/hooks'

export function Primary() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { t, i18n } = useTranslation('views')

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
              <Title order={3}>Все элементы</Title>
              <Text>Работа</Text>
              <Text>Финансы</Text>
              <Text>Путешествие</Text>
              <Text>Удостоверение</Text>
              <Text>Заметка</Text>
              <Text>Компьютер</Text>
              <Text>Семья</Text>
              <Text>Разное</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
              <Text>Элемент X</Text>
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
