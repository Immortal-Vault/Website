import { Anchor, Container, Group, rem, Text } from '@mantine/core'
import classes from './RootFooter.module.css'
import { FaLinkedin, FaTelegramPlane } from 'react-icons/fa'
import { IoLogoGithub } from 'react-icons/io'
import { useTranslation } from 'react-i18next'
import { MdOutlinePolicy } from 'react-icons/md'

const links = [
  {
    link: 'https://t.me/immortal_vault',
    element: (
      <FaTelegramPlane
        style={{
          width: rem(24),
          height: rem(24),
        }}
      />
    ),
  },
  {
    link: 'https://www.linkedin.com/company/immortal-vault/',
    element: (
      <FaLinkedin
        style={{
          width: rem(24),
          height: rem(24),
        }}
      />
    ),
  },
  {
    link: 'https://github.com/Immortal-Vault',
    element: (
      <IoLogoGithub
        style={{
          width: rem(24),
          height: rem(24),
        }}
      />
    ),
  },
  {
    link: '/privacy-policy',
    element: (
      <MdOutlinePolicy
        style={{
          width: rem(24),
          height: rem(24),
        }}
      />
    ),
  },
]

export function RootFooter() {
  const { t } = useTranslation('root')

  const items = links.map((e) => (
    <Anchor<'a'>
      c='dimmed'
      key={e.link}
      href={e.link}
      style={{
        outline: 'none',
      }}
    >
      {e.element}
    </Anchor>
  ))

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Anchor<'a'>
          c='dimmed'
          underline={'never'}
          key={'https://github.com/litolax'}
          href={'https://github.com/litolax'}
        >
          <Text>
            {t('footer.text')} <Anchor<'a'> underline={'never'}>{'litolax'}</Anchor>
          </Text>
        </Anchor>
        <Group pt={'10px'}>{items}</Group>
      </Container>
    </div>
  )
}
