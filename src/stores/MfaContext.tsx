import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Button,
  Center,
  Divider,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { disableMfa, enableMfa, setupMfa, validateMfa } from '../api/mfa';
import { useTranslation } from 'react-i18next';
import { useEnvVars } from './';
import QRCode from 'qrcode';
import { LOCAL_STORAGE, sendErrorNotification } from '../shared';
import { getCopyButton } from '../components';

export enum MfaModalState {
  SETUP = 'setup',
  ENABLE = 'enable',
  DISABLE = 'disable',
  VALIDATE = 'validate',
  NONE = 'none',
}

export interface MfaContextType {
  isMfaEnabled: boolean;
  isMfaModalOpen: boolean;
  totpCode: string | null;
  mfaQrCode: string | null;
  recoveryCodes: string[] | null;
  modalState: MfaModalState;
  setTotpCode: (value: string | null) => void;
  setMfaEnabled: (value: boolean) => void;
  openMfaModalWithState: (
    state: MfaModalState,
    submitCallback?: (data: string) => void,
    closeCallback?: () => void,
  ) => void;
  closeMfaModal: () => void;
  handleSetupMfa: () => Promise<void>;
  handleEnableMfa: (totpCode: string) => Promise<void>;
  handleDisableMfa: (totpCode: string) => Promise<void>;
  handleValidateMfa: (totpCode: string) => Promise<boolean>;
}

const MfaContext = createContext<MfaContextType | undefined>(undefined);

interface MfaProviderProps {
  children: ReactNode;
}

export const MfaProvider = ({ children }: MfaProviderProps) => {
  const { t } = useTranslation('auth');
  const { envs } = useEnvVars();
  const [isMfaModalOpen, { open: openMfaModal, close: closeMfaModal }] = useDisclosure(false);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfa, setMfa] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [modalState, setModalState] = useState<MfaModalState>(MfaModalState.NONE);
  const [totpCode, setTotpCode] = useState<string | null>(null);
  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean>(
    localStorage.getItem(LOCAL_STORAGE.MFA_ENABLED) === 'true',
  );
  const [modalSubmitCallback, setModalSubmit] = useState<((data: string | null) => void) | null>(
    null,
  );
  const [modalCloseCallback, setModalClose] = useState<(() => void) | null>(null);

  const openMfaModalWithState = (
    state: MfaModalState,
    submitCallback?: (data: string) => void,
    closeCallback?: () => void,
  ) => {
    setModalState(state);
    setModalSubmit(() => submitCallback || null);
    setModalClose(() => closeCallback || null);
    setTotpCode(null);
    setRecoveryCodes(null);
    openMfaModal();
  };

  const handleSetupMfa = async (): Promise<void> => {
    try {
      const secret = await setupMfa(envs, t);
      setMfa(secret);

      if (!secret) {
        return;
      }

      const identifier = localStorage.getItem(LOCAL_STORAGE.LAST_EMAIL);
      const otpAuthUrl = `otpauth://totp/${encodeURIComponent(import.meta.env.VITE_APP_NAME)}:${identifier}?secret=${secret}&issuer=${encodeURIComponent(import.meta.env.VITE_APP_NAME)}`;
      const qr = await QRCode.toDataURL(otpAuthUrl, { errorCorrectionLevel: 'H' });

      setMfaQrCode(qr);
      openMfaModalWithState(MfaModalState.SETUP, (code: string | null) => {
        if (!code) {
          return sendErrorNotification(t('notifications:incorrectMfaCode'));
        }

        enableMfa(code, envs, t).then((result) => {
          if (!result) {
            return;
          }

          setRecoveryCodes(result);
          setMfaEnabled(true);
          setModalSubmit(null);
          setMfa(null);
          setModalState(MfaModalState.ENABLE);
        });
      });
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

  const handleDisableMfa = async (totpCode: string): Promise<void> => {
    const result = await disableMfa(totpCode, envs, t);
    if (!result) {
      return;
    }

    setMfaQrCode(null);
    setMfaEnabled(false);
    setRecoveryCodes(null);
    closeMfaModal();
  };

  const handleValidateMfa = async (totpCode: string): Promise<boolean> => {
    const result = await validateMfa(totpCode, envs, t);
    if (!result) {
      return result;
    }

    setTotpCode(null);
    closeMfaModal();
    return result;
  };

  const setMfaEnabled = (value: boolean): void => {
    setIsMfaEnabled(value);
    localStorage.setItem(LOCAL_STORAGE.MFA_ENABLED, JSON.stringify(value));
  };

  const contextValue = useMemo(
    () => ({
      isMfaModalOpen,
      isMfaEnabled,
      totpCode,
      mfaQrCode,
      recoveryCodes,
      modalState,
      setTotpCode,
      setMfaEnabled,
      openMfaModalWithState,
      closeMfaModal,
      handleSetupMfa,
      handleEnableMfa,
      handleDisableMfa,
      handleValidateMfa,
    }),
    [isMfaModalOpen, mfaQrCode, recoveryCodes, modalState, isMfaEnabled, totpCode],
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
        title={t(`mfa.modalTitle.${modalState}`)}
        centered
      >
        <Group align={'center'} justify='center'>
          {modalState === MfaModalState.SETUP && mfa && mfaQrCode && (
            <Stack>
              <Text>{t('mfa.scanQrCode')}</Text>
              <Center>
                <Image h={192} w={192} src={mfaQrCode} alt={t('mfa.qrCodeAlt')} />
              </Center>
            </Stack>
          )}
          {(modalState === MfaModalState.SETUP ||
            modalState === MfaModalState.DISABLE ||
            modalState === MfaModalState.VALIDATE) && (
            <Stack>
              <Text>{t(`mfa.${modalState}Instruction`)}</Text>
              {modalState === MfaModalState.SETUP && mfa && (
                <>
                  <Divider />
                  <Group>
                    <Text>{mfa}</Text>
                    {getCopyButton(mfa, t)}
                  </Group>
                </>
              )}
              <TextInput
                value={totpCode ?? ''}
                onChange={(e) => setTotpCode(e.currentTarget.value)}
                placeholder={t('mfa.totpPlaceholder')}
                label={t('mfa.totpLabel')}
              />{' '}
              <Group mt='xl' justify={'end'}>
                <Button
                  variant={'outline'}
                  color={'red'}
                  onClick={() => {
                    modalCloseCallback?.();
                    closeMfaModal();
                  }}
                >
                  {t('mfa.cancelButton')}
                </Button>
                <Button
                  onClick={() => {
                    modalSubmitCallback?.(totpCode);
                  }}
                  disabled={!totpCode}
                >
                  {t('mfa.submitButton')}
                </Button>
              </Group>
            </Stack>
          )}
          {modalState === MfaModalState.ENABLE && recoveryCodes && (
            <Stack>
              <Text>{t('mfa.recoveryCodesInstruction')}</Text>
              <Stack gap='xs'>
                {recoveryCodes.map((code, index) => (
                  <Text key={index}>{code}</Text>
                ))}
              </Stack>
              <Group mt='xl' justify={'end'}>
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
                  {t('mfa.downloadButton')}
                </Button>
                <Button
                  onClick={() => {
                    modalSubmitCallback?.('');
                    closeMfaModal();
                  }}
                >
                  {t('mfa.confirmButton')}
                </Button>
              </Group>
            </Stack>
          )}
        </Group>
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
