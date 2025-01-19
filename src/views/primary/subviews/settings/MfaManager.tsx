import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MfaModalState, useMfa } from '../../../../stores';

export const MfaManager = (): JSX.Element => {
  const { t } = useTranslation('auth');
  const { isMfaEnabled, handleSetupMfa, handleDisableMfa, openMfaModalWithState } = useMfa();

  return (
    <Card shadow='md' padding='lg' radius='md' style={{ width: '400px' }}>
      <Title order={2} mb='xl'>
        {t('mfa.managerTitle')}
      </Title>
      <Group align={'center'} mt='md' mb='md'>
        <Text size='lg' w={500}>
          {t('mfa.statusTitle')}:{' '}
          <Badge color={isMfaEnabled ? 'green' : 'red'}>
            {isMfaEnabled ? t('mfa.enabled') : t('mfa.disabled')}
          </Badge>
        </Text>
      </Group>

      <Stack>
        {!isMfaEnabled ? (
          <Button
            fullWidth
            onClick={() => {
              handleSetupMfa();
            }}
          >
            {t('mfa.enableMfaButton')}
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              color='red'
              onClick={() => {
                openMfaModalWithState(MfaModalState.DISABLE, async (totpCode) => {
                  if (totpCode) {
                    await handleDisableMfa(totpCode);
                  }
                });
              }}
            >
              {t('mfa.disableMfaButton')}
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
};
