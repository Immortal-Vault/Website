import { useContext, useState } from 'react'
import { ELanguage } from '../../../../types'
import { useTranslation } from 'react-i18next'
import { Select, Title, Container, Stack, LoadingOverlay } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { sendErrorNotification, sendSuccessNotification } from '../../../../shared'
import useEnvVars from '../../../../hooks/useEnvVars.ts'
import { AuthContext } from '../../../../stores/AuthContext.tsx'

export const Main = (): JSX.Element => {
  const [language, setLanguage] = useState<ELanguage | null>(null)
  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
  ]
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const { t, i18n } = useTranslation('settings')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const envs = useEnvVars()
  const authContext = useContext(AuthContext)!

  const selectLanguage = async (newLanguage: string | null) => {
    if (!newLanguage) {
      return
    }

    setLoaderState.open()
    setLanguage(newLanguage as ELanguage)
    await i18n.changeLanguage(newLanguage ?? 'en')

    let response

    try {
      response = await fetch(`${envs?.API_SERVER_URL}/user/changeLanguage`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email: authContext.email, language: newLanguage }),
      })
    } catch (error) {
      sendErrorNotification(t('notifications:serverNotResponding'))
      setLoaderState.close()
      return
    }

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('notifications:userNotFound', { user: authContext.email }))
          setLoaderState.close()
          return
        }
        default: {
          sendErrorNotification(t('notifications:failedError'))
          console.error(await response.text())
          setLoaderState.close()
          return
        }
      }
    }

    setLoaderState.close()
    sendSuccessNotification(
      t('notifications:languageChanged', {
        language: languages.find((lng) => lng.value === newLanguage)?.label,
      }),
    )
  }

  const MobileView = () => (
    <Container size='xs' mt='0.2rem'>
      <Stack align='center'>
        <Title order={2} mb='md'>
          {t('main.header')}
        </Title>
        <Select
          label={t('main.language.title')}
          placeholder={t('main.language.placeholder')}
          nothingFoundMessage={t('main.language.nothingFound')}
          value={language}
          data={languages}
          onChange={selectLanguage}
          searchable
          checkIconPosition='right'
          radius='md'
          w='100%'
        />
      </Stack>
    </Container>
  )

  const DesktopView = () => (
    <div>
      <Title order={1} mb={'10px'}>
        {t('main.header')}
      </Title>
      <div
        style={{
          width: '15rem',
        }}
      >
        <Select
          label={t('main.language.title')}
          placeholder={t('main.language.placeholder')}
          nothingFoundMessage={t('main.language.nothingFound')}
          value={language}
          data={languages}
          onChange={selectLanguage}
          searchable
          checkIconPosition='right'
        />
      </div>
    </div>
  )

  return (
    <div>
      <LoadingOverlay
        visible={loaderVisible}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue' }}
      />
      {!isMobile ? <DesktopView /> : <MobileView />}
    </div>
  )
}
