import { Center, Container, Flex, Group, Image, Text, Title } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorPageProps {
  error?: string;
}

export const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  const { t } = useTranslation('errorBoundary');
  return (
    <Container size='sm'>
      <Center style={{ height: '100vh' }}>
        <Group align={'center'} justify={'center'}>
          <Flex direction={'column'}>
            <Title ta={'center'} order={2} mb='md'>
              {t('title')}
            </Title>
            <Text ta={'center'} c='dimmed' size='lg' mb='lg'>
              {t(error ? 'message.boundary' : 'message.router')}
            </Text>
            {error && (
              <Text ta={'center'} c='dimmed' size='lg' mb='lg'>
                {t('error', { error })}
              </Text>
            )}
          </Flex>
          <Image src={'/error.png'} w={'60%'} alt={'error-smile'} />
        </Group>
      </Center>
    </Container>
  );
};
