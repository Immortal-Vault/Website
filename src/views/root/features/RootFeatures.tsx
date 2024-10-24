import { Card, Container, rem, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core'
import classes from './RootFeatures.module.css'
import { FaLock } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { MdOutlineDevices } from 'react-icons/md'

const featuresData = [
  {
    title: 'Privacy focused',
    description:
      'All data processing happens on the client, so user passwords and logins are stored in encrypted form in vaults on their end',
    icon: FaLock,
  },
  {
    title: 'Ease of use',
    description:
      'Our product is available on any device. We have tried to provide full adaptability for easy use from anywhere.',
    icon: MdOutlineDevices,
  },
  {
    title: ' Multilanguage support',
    description:
      'Our users are located in different parts of the world, so we support such languages as: English, Russian, the list will be replenished.',
    icon: GrLanguage,
  },
]

export function RootFeature() {
  const theme = useMantineTheme()
  const features = featuresData.map((feature) => (
    <Card key={feature.title} shadow='md' radius='md' className={classes.card} padding='xl'>
      <feature.icon style={{ width: rem(50), height: rem(50) }} color={theme.colors.blue[6]} />
      <Text fz='lg' fw={500} className={classes.cardTitle} mt='md'>
        {feature.title}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {feature.description}
      </Text>
    </Card>
  ))

  return (
    <Container size='lg' py='xl'>
      <Title order={2} className={classes.title} ta='center'>
        Our Benefits
      </Title>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl' mt={'xl'}>
        {features}
      </SimpleGrid>
    </Container>
  )
}
