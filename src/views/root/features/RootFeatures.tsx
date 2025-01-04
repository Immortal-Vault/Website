import { Card, Container, rem, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core';
import classes from './RootFeatures.module.css';
import { FaLock } from 'react-icons/fa';
import { GrLanguage } from 'react-icons/gr';
import { MdOutlineDevices } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const featuresData = [
  {
    title: 'features.elements.1.title',
    description: 'features.elements.1.description',
    icon: FaLock,
  },
  {
    title: 'features.elements.2.title',
    description: 'features.elements.2.description',
    icon: MdOutlineDevices,
  },
  {
    title: 'features.elements.3.title',
    description: 'features.elements.3.description',
    icon: GrLanguage,
  },
];

export function RootFeature() {
  const theme = useMantineTheme();
  const { t } = useTranslation('root');

  const features = featuresData.map((feature) => (
    <Card key={feature.title} shadow='md' radius='md' className={classes.card} padding='xl'>
      <feature.icon style={{ width: rem(50), height: rem(50) }} color={theme.colors.blue[6]} />
      <Text fz='lg' fw={500} className={classes.cardTitle} mt='md'>
        {t(feature.title)}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {t(feature.description)}
      </Text>
    </Card>
  ));

  return (
    <Container size='lg' py='xl'>
      <Title order={2} className={classes.title} ta='center'>
        {t('features.title')}
      </Title>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl' mt={'xl'}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
