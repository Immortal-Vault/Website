import { Anchor, Container, Group, rem, Text } from '@mantine/core';
import classes from './Footer.module.css';
import { FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import { IoLogoGithub } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { ROUTER_PATH } from '../../shared';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../LanguageSelector.tsx';

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
];

export function Footer() {
  const { t } = useTranslation('root');
  const navigate = useNavigate();

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
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Anchor<'a'>
          c='dimmed'
          underline={'never'}
          key={ROUTER_PATH.PRIVACY_POLICY}
          onClick={() => {
            navigate(ROUTER_PATH.PRIVACY_POLICY);
          }}
          style={{
            outline: 'none',
          }}
        >
          <Text>{t('footer.privacy')}</Text>
        </Anchor>
        <Group pt={'5px'} justify={'center'} align={'center'}>
          {items}
          <div
            style={{
              paddingBottom: '0.3rem',
            }}
          >
            <LanguageSelector settings={false} />
          </div>
          <Text c='dimmed'>{import.meta.env.VITE_WEBSITE_VERSION}</Text>
        </Group>
      </Container>
    </div>
  );
}
