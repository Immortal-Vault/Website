import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EAuthState, EPrimaryViewPage } from '../types';
import { signOut } from '../api';
import { useTranslation } from 'react-i18next';
import { LOCAL_STORAGE, sendNotification } from '../shared';
import { useEnvVars, useMenu } from './';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Button, Group, Input, Modal } from '@mantine/core';

export interface AuthContextType {
  authState: EAuthState;
  authEmail: string;
  authUsername: string;
  secretPassword: string;
  secretPasswordModalState: boolean;
  modalSubmitCallback: (() => void) | null | undefined;
  modalCloseCallback: (() => void) | null | undefined;
  openSecretPasswordModal: (submitCallback?: () => void, closeCallback?: () => void) => void;
  closeSecretPasswordModal: () => void;
  setSecretPassword: Dispatch<SetStateAction<string>>;
  authSignIn: (email: string, username: string, localization: string) => void;
  authSignOut: (expired: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authState: EAuthState.Deauthorized,
  authEmail: '',
  authUsername: '',
  secretPassword: '',
  secretPasswordModalState: false,
  modalCloseCallback: null,
  modalSubmitCallback: null,
  setSecretPassword: function (): void {
    throw new Error('Function is not implemented.');
  },
  openSecretPasswordModal: function (): void {
    throw new Error('Function is not implemented.');
  },
  closeSecretPasswordModal: function (): void {
    throw new Error('Function is not implemented.');
  },
  authSignIn: function (_email: string, _username: string, _localization: string): void {
    throw new Error('Function is not implemented.');
  },
  authSignOut: async function (_expired: boolean): Promise<void> {
    throw new Error('Function is not implemented.');
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t, i18n } = useTranslation();
  const { envs } = useEnvVars();
  const { setCurrentPage } = useMenu();
  const [
    secretPasswordModalState,
    { open: openSecretPasswordModal, close: closeSecretPasswordModal },
  ] = useDisclosure(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [secretPassword, setSecretPassword] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const authPingInterval = useInterval(() => authPing(), 10000);
  const [authState, setAuthState] = useState<EAuthState>(
    (localStorage.getItem(LOCAL_STORAGE.AUTH_STATE) as EAuthState) ?? EAuthState.Deauthorized,
  );

  const [modalCloseCallback, setModalClose] = useState<(() => void) | null | undefined>();
  const [modalSubmitCallback, setModalSubmit] = useState<(() => void) | null | undefined>();

  useEffect(() => {
    if (authEmail) {
      return;
    }

    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE);
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization);
    }
  }, []);

  const setAuthSignIn = (email: string, username: string, localization: string): void => {
    setAuthState(EAuthState.Authorized);
    setAuthEmail(email);
    setAuthUsername(username);

    i18n.changeLanguage(localization);
  };

  const setAuthSignOut = async (expired: boolean): Promise<void> => {
    await signOut(envs, t);
    setAuthState(EAuthState.Deauthorized);
    setAuthEmail('');
    setAuthUsername('');
    setSecretPassword('');
    localStorage.removeItem(LOCAL_STORAGE.USER_LOCALE);
    i18n.changeLanguage(undefined);

    if (expired) {
      sendNotification(t('notifications:sessionExpired'));
    }
  };

  const authPing = () => {
    fetch(`${envs?.API_SERVER_URL}/auth/ping`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => {
        if (!response || !response.ok) {
          setAuthSignOut(true);
        }
      })
      .catch((_e) => {
        setAuthSignOut(true);
      });
  };

  useEffect(() => {
    if (authState) {
      localStorage.setItem(LOCAL_STORAGE.AUTH_STATE, authState);
    } else {
      localStorage.removeItem(LOCAL_STORAGE.AUTH_STATE);
    }
  }, [authState]);

  useEffect(() => {
    if (authState !== EAuthState.Authorized) {
      authPingInterval.stop();
    } else {
      authPingInterval.start();
    }

    return authPingInterval.stop;
  }, [authState]);

  const openSecretPasswordModalWithCallback = (
    submitCallback?: () => void,
    closeCallback?: () => void,
  ): void => {
    openSecretPasswordModal();

    setModalSubmit(() => submitCallback);
    setModalClose(() => closeCallback);
  };

  const contextValue = useMemo(
    () => ({
      authState,
      authEmail,
      authUsername,
      secretPassword,
      secretPasswordModalState,
      setSecretPassword,
      modalSubmitCallback,
      modalCloseCallback,
      openSecretPasswordModal: openSecretPasswordModalWithCallback,
      closeSecretPasswordModal,
      authSignIn: setAuthSignIn,
      authSignOut: setAuthSignOut,
    }),
    [authState, authEmail, authUsername, secretPassword, secretPasswordModalState],
  );

  return (
    <>
      <Modal
        centered={true}
        opened={secretPasswordModalState}
        onClose={closeSecretPasswordModal}
        size='auto'
        title={t('vault:modals.masterPassword.title')}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Input type={'password'} onChange={(e) => setPasswordInput(e.target.value)} />

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              setCurrentPage(EPrimaryViewPage.None);
              if (modalCloseCallback) {
                modalCloseCallback();
              }
              closeSecretPasswordModal();
            }}
          >
            {t('vault:modals.masterPassword.buttons.cancel')}
          </Button>
          <Button
            onClick={() => {
              setSecretPassword(passwordInput);
              if (modalSubmitCallback) {
                modalSubmitCallback();
              }
            }}
          >
            {t('vault:modals.masterPassword.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
