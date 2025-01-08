import { Container, Text, Divider, Title } from '@mantine/core';
import { Footer, RootHeader } from '../../../components';
import { useTranslation } from 'react-i18next';
import { ScrollRestoration } from 'react-router-dom';

const privacySections = [
  'general_provisions',
  'interpretation_and_definitions',
  'collecting_and_using_your_personal_data',
  'tracking_technologies_and_cookies',
  'use_of_your_personal_data',
  'retention_of_your_personal_data',
  'transfer_of_your_personal_data',
  'delete_your_personal_data',
  'disclosure_of_your_personal_data',
  'security_of_your_personal_data',
  'childrens_privacy',
  'links_to_other_websites',
  'changes_to_this_privacy_policy',
  'contact_us',
];

export function PrivacyPolicy() {
  const { t } = useTranslation('privacyPolicy');

  return (
    <>
      <RootHeader />
      <Container size='xl' mb='xl'>
        <Title order={1} style={{ marginTop: '10px', marginBottom: '10px' }}>
          {t('header')}
        </Title>
        <Divider />
        <Title order={2} style={{ marginTop: '10px', marginBottom: '10px' }}>
          {t('last_updated')}
        </Title>
        <Divider style={{ paddingBottom: '10px' }} />
        {privacySections.map((sectionKey, index) => {
          const section: any = t(sectionKey, { returnObjects: true });
          const sectionNumber = index + 1;

          return (
            <section
              key={sectionKey}
              style={{
                marginBottom: '2rem',
              }}
            >
              {' '}
              <Title order={2} mb={'xs'}>
                {sectionNumber}. {section['title']}
              </Title>
              {Array.isArray(section.items) && (
                <ol>
                  {section.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex}>
                      <Text size={'lg'}>{item}</Text>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </Container>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
