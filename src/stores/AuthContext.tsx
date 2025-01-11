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
import { EAuthState } from '../types';
import { signOut } from '../api';
import { useTranslation } from 'react-i18next';
import { LOCAL_STORAGE, sendNotification } from '../shared';
import { useEnvVars } from './';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Button, Group, Input, Modal } from '@mantine/core';

export interface AuthContextType {
  authState: EAuthState;
  authEmail: string;
  authUsername: string;
  secretPassword: string;
  secretPasswordModalState: boolean;
  is12HoursFormat: boolean;
  modalSubmitCallback: ((masterPassword: string) => void) | null | undefined;
  modalCloseCallback: (() => void) | null | undefined;
  openSecretPasswordModal: (
    submitCallback?: (masterPassword: string) => void,
    closeCallback?: () => void,
  ) => void;
  closeSecretPasswordModal: () => void;
  setSecretPassword: Dispatch<SetStateAction<string>>;
  authSignIn: (
    email: string,
    username: string,
    localization: string,
    is12HoursFormat: boolean,
  ) => void;
  authSignOut: (expired: boolean) => Promise<void>;
  setIsFetchInProgress: Dispatch<SetStateAction<boolean>>;
  setIs12HoursFormat: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  authState: EAuthState.Deauthorized,
  authEmail: '',
  authUsername: '',
  secretPassword: '',
  secretPasswordModalState: false,
  modalCloseCallback: null,
  modalSubmitCallback: null,
  is12HoursFormat: false,
  setSecretPassword: function (): void {
    throw new Error('Function is not implemented.');
  },
  openSecretPasswordModal: function (): void {
    throw new Error('Function is not implemented.');
  },
  closeSecretPasswordModal: function (): void {
    throw new Error('Function is not implemented.');
  },
  authSignIn: function (
    _email: string,
    _username: string,
    _localization: string,
    _is12HoursFormat: boolean,
  ): void {
    throw new Error('Function is not implemented.');
  },
  authSignOut: async function (_expired: boolean): Promise<void> {
    throw new Error('Function is not implemented.');
  },
  setIsFetchInProgress: async function (): Promise<void> {
    throw new Error('Function is not implemented.');
  },
  setIs12HoursFormat: async function (): Promise<void> {
    throw new Error('Function is not implemented.');
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t, i18n } = useTranslation();
  const { envs } = useEnvVars();
  const [
    secretPasswordModalState,
    { open: openSecretPasswordModal, close: closeSecretPasswordModal },
  ] = useDisclosure(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [secretPassword, setSecretPassword] = useState('');
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [is12HoursFormat, setIs12HoursFormat] = useState(false);
  const authPingInterval = useInterval(() => authPing(), 10000);
  const [authState, setAuthState] = useState<EAuthState>(
    (localStorage.getItem(LOCAL_STORAGE.AUTH_STATE) as EAuthState) ?? EAuthState.Deauthorized,
  );

  const [modalCloseCallback, setModalClose] = useState<(() => void) | null | undefined>();
  const [modalSubmitCallback, setModalSubmit] = useState<
    ((masterPassword: string) => void) | null | undefined
  >();

  useEffect(() => {
    if (!authEmail) {
      return;
    }

    const localization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE);
    i18n.changeLanguage(localization ?? 'en');

    const is12HoursFormat = localStorage.getItem(LOCAL_STORAGE.USER_TIME_FORMAT);
    if (is12HoursFormat) {
      setIs12HoursFormat(JSON.parse(is12HoursFormat));
    }
  }, [authEmail]);

  const setAuthSignIn = (
    email: string,
    username: string,
    localization: string,
    is12HoursFormat: boolean,
  ): void => {
    setAuthState(EAuthState.Authorized);
    setAuthEmail(email);
    setAuthUsername(username);

    i18n.changeLanguage(localization);
    setIs12HoursFormat(is12HoursFormat);
  };

  const setAuthSignOut = async (expired: boolean): Promise<void> => {
    await signOut(envs, t);
    setAuthState(EAuthState.Deauthorized);
    setAuthEmail('');
    setAuthUsername('');
    setSecretPassword('');
    localStorage.removeItem(LOCAL_STORAGE.USER_LOCALE);
    localStorage.removeItem(LOCAL_STORAGE.USER_TIME_FORMAT);
    i18n.changeLanguage(undefined);
    setIs12HoursFormat(false);

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
    submitCallback?: (masterPassword: string) => void,
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
      is12HoursFormat,
      setSecretPassword,
      modalSubmitCallback,
      modalCloseCallback,
      openSecretPasswordModal: openSecretPasswordModalWithCallback,
      closeSecretPasswordModal,
      authSignIn: setAuthSignIn,
      authSignOut: setAuthSignOut,
      setIsFetchInProgress,
      setIs12HoursFormat,
    }),
    [authState, authEmail, authUsername, secretPassword, secretPasswordModalState, is12HoursFormat],
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
              if (modalCloseCallback) {
                modalCloseCallback();
              }
              closeSecretPasswordModal();
            }}
          >
            {t('vault:modals.masterPassword.buttons.cancel')}
          </Button>
          <Button
            disabled={isFetchInProgress}
            onClick={() => {
              setSecretPassword(passwordInput);
              if (modalSubmitCallback) {
                modalSubmitCallback(passwordInput);
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
