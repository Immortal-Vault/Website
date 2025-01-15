import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Center, Group, Image, Modal, Stack, Text, TextInput } from '@mantine/core';
import { disableMfa, enableMfa, setupMfa, validateMfa } from '../api/mfa';
import { useTranslation } from 'react-i18next';
import { useEnvVars } from './';
import QRCode from 'qrcode';

export enum MfaModalState {
  SETUP = 'setup',
  ENABLE = 'enable',
  DISABLE = 'disable',
  VALIDATE = 'validate',
  NONE = 'none',
}

export interface MfaContextType {
  isMfaModalOpen: boolean;
  mfaQrCode: string | null;
  recoveryCodes: string[] | null;
  modalState: MfaModalState;
  openMfaModalWithState: (
    state: MfaModalState,
    submitCallback?: (data: string) => void,
    closeCallback?: () => void,
  ) => void;
  closeMfaModal: () => void;
  handleSetupMfa: () => Promise<void>;
  handleEnableMfa: (totpCode: string) => Promise<void>;
  handleDisableMfa: (password: string, totpCode: string) => Promise<void>;
  handleValidateMfa: (totpCode: string) => Promise<boolean>;
}

const MfaContext = createContext<MfaContextType | undefined>(undefined);

interface MfaProviderProps {
  children: ReactNode;
}

export const MfaProvider = ({ children }: MfaProviderProps) => {
  const { t } = useTranslation();
  const { envs } = useEnvVars();
  const [isMfaModalOpen, { open: openMfaModal, close: closeMfaModal }] = useDisclosure(false);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfa, setMfa] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [modalState, setModalState] = useState<MfaModalState>(MfaModalState.NONE);
  const [totpCode, setTotpCode] = useState<string>(''); // Добавлено поле для ввода TOTP
  const [modalSubmitCallback, setModalSubmit] = useState<((data: string) => void) | null>(null);
  const [modalCloseCallback, setModalClose] = useState<(() => void) | null>(null);

  const openMfaModalWithState = (
    state: MfaModalState,
    submitCallback?: (data: string) => void,
    closeCallback?: () => void,
  ) => {
    setModalState(state);
    setModalSubmit(() => submitCallback || null);
    setModalClose(() => closeCallback || null);
    setTotpCode('');
    openMfaModal();
  };

  const handleSetupMfa = async (): Promise<void> => {
    try {
      const secret = await setupMfa(envs, t);
      setMfa(secret);

      if (secret) {
        const otpAuthUrl = `otpauth://totp/${import.meta.env.VITE_APP_NAME}?secret=${secret}&issuer=${encodeURIComponent(import.meta.env.VITE_APP_NAME)}`;
        const qr = await QRCode.toDataURL(otpAuthUrl, { errorCorrectionLevel: 'H' });
        setMfaQrCode(qr);
        openMfaModalWithState(MfaModalState.SETUP);
      }
    } catch (error) {
      console.error('Error during MFA setup:', error);
    }
  };

  const handleEnableMfa = async (totpCode: string): Promise<void> => {
    const codes = await enableMfa(totpCode, envs, t);
    if (codes) {
      setRecoveryCodes(codes);
      closeMfaModal();
    }
  };

  const handleDisableMfa = async (password: string, totpCode: string): Promise<void> => {
    const result = await disableMfa(password, totpCode, envs, t);
    if (result) {
      setMfaQrCode(null);
      setRecoveryCodes(null);
      closeMfaModal();
    }
  };

  const handleValidateMfa = async (totpCode: string): Promise<boolean> => {
    return await validateMfa(totpCode, envs, t);
  };

  const contextValue = useMemo(
    () => ({
      isMfaModalOpen,
      mfaQrCode,
      recoveryCodes,
      modalState,
      openMfaModalWithState,
      closeMfaModal,
      handleSetupMfa,
      handleEnableMfa,
      handleDisableMfa,
      handleValidateMfa,
    }),
    [isMfaModalOpen, mfaQrCode, recoveryCodes, modalState],
  );

  return (
    <MfaContext.Provider value={contextValue}>
      {children}
      <Modal
        opened={isMfaModalOpen}
        onClose={() => {
          closeMfaModal();
          modalCloseCallback?.();
        }}
        title={t(`mfa:modalTitle.${modalState}`)}
        centered
      >
        <Center>
          {modalState === MfaModalState.SETUP && mfa && mfaQrCode && (
            <Stack>
              <Image src={mfaQrCode} alt={t('mfa:qrCodeAlt')} />
              <Text>{t('mfa:scanQrCode')}</Text>
              <Text>{t('mfa:secretForManual', { mfa })}</Text>
            </Stack>
          )}
          {(modalState === MfaModalState.SETUP ||
            modalState === MfaModalState.DISABLE ||
            modalState === MfaModalState.VALIDATE) && (
            <Stack>
              <Text>{t(`mfa:${modalState}Instruction`)}</Text>
              <TextInput
                value={totpCode}
                onChange={(e) => setTotpCode(e.currentTarget.value)}
                placeholder={t('mfa:totpPlaceholder')}
                label={t('mfa:totpLabel')}
              />{' '}
              <Group mt='md'>
                <Button
                  onClick={() => {
                    if (!modalCloseCallback) {
                      throw Error('mfa:callbackEmpty');
                    }

                    modalCloseCallback();
                    closeMfaModal();
                  }}
                >
                  {t('mfa:closeButton')}
                </Button>
                <Button
                  onClick={() => {
                    modalSubmitCallback?.(totpCode);
                  }}
                  disabled={!totpCode}
                >
                  {t('mfa:submitButton')}
                </Button>
              </Group>
            </Stack>
          )}
          {modalState === MfaModalState.ENABLE && recoveryCodes && (
            <Stack>
              <Text>{t('mfa:recoveryCodesInstruction')}</Text>
              <Stack gap='xs'>
                {recoveryCodes.map((code, index) => (
                  <Text key={index}>{code}</Text>
                ))}
              </Stack>
              <Group>
                <Button
                  onClick={() => {
                    const blob = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'recovery_codes.txt';
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }}
                >
                  {t('mfa:downloadButton')}
                </Button>
                <Button
                  onClick={() => {
                    modalSubmitCallback?.('');
                    closeMfaModal();
                  }}
                >
                  {t('mfa:confirmButton')}
                </Button>
              </Group>
            </Stack>
          )}
        </Center>
      </Modal>
    </MfaContext.Provider>
  );
};

export const useMfa = (): MfaContextType => {
  const context = useContext(MfaContext);
  if (!context) {
    throw new Error('useMfa must be used within a MfaProvider');
  }
  return context;
};

export default MfaProvider;
