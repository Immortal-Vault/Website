import { Accordion, Container, Title } from '@mantine/core';
import classes from './RootFaq.module.css';
import { useTranslation } from 'react-i18next';

const faqData = [
  {
    title: 'faq.elements.1.question',
    description: 'faq.elements.1.answer',
  },
  {
    title: 'faq.elements.2.question',
    description: 'faq.elements.2.answer',
  },
  {
    title: 'faq.elements.3.question',
    description: 'faq.elements.3.answer',
  },
  {
    title: 'faq.elements.4.question',
    description: 'faq.elements.4.answer',
  },
];

export function RootFaq() {
  const { t } = useTranslation('root');

  const faqElements = faqData.map((faq) => (
    <Accordion.Item className={classes.item} value={faq.title} key={faq.title}>
      <Accordion.Control>{t(faq.title)}</Accordion.Control>
      <Accordion.Panel>{t(faq.description)}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Container size='sm' className={classes.wrapper}>
      <Title ta='center' className={classes.title} mb={'xl'}>
        {t('faq.title')}
      </Title>

      <Accordion variant='separated'>{faqElements}</Accordion>
    </Container>
  );
}
