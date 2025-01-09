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
import { TFolder, TSecret, TSecretFile } from '../types';
import { useGoogleDrive } from './GoogleDriveContext.tsx';
import { toast } from 'react-toastify';
import { customFetch, uploadSecretFile } from '../api';
import { decrypt, encrypt, SECRET_FILE_VERSION } from '../shared';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext.tsx';
import { useEnvVars } from './EnvVarsContext.tsx';
import { applyMigrations } from '../migrations';

export interface SecretsContextType {
  secrets: TSecret[] | null;
  filteredSecrets: TSecret[] | null;
  selectedSecret: TSecret | null;
  folders: TFolder[];
  selectedFolder: TFolder | null;
  fetchSecrets: () => Promise<void>;
  setSecrets: Dispatch<SetStateAction<TSecret[] | null>>;
  setFolders: Dispatch<SetStateAction<TFolder[]>>;
  setSelectedFolder: Dispatch<SetStateAction<TFolder | null>>;
  setSelectedSecret: Dispatch<SetStateAction<TSecret | null>>;
  setFilteredSecrets: Dispatch<SetStateAction<TSecret[] | null>>;
  saveSecrets: (secrets: TSecret[], folders: TFolder[]) => Promise<void>;
  deleteSecret: (secret: TSecret) => Promise<void>;
}

const SecretsContext = createContext<SecretsContextType>({
  secrets: null,
  filteredSecrets: null,
  selectedSecret: null,
  folders: [],
  selectedFolder: null,
  setSecrets: function (): void {
    throw new Error('Function is not implemented.');
  },
  fetchSecrets: (): Promise<void> => {
    throw new Error('Function is not implemented.');
  },
  setSelectedSecret: function (): void {
    throw new Error('Function is not implemented.');
  },
  setFilteredSecrets: function (): void {
    throw new Error('Function is not implemented.');
  },
  setFolders: function (): void {
    throw new Error('Function is not implemented.');
  },
  setSelectedFolder: function (): void {
    throw new Error('Function is not implemented.');
  },
  saveSecrets: function (_secrets: TSecret[], _folders: TFolder[]): Promise<void> {
    throw new Error('Function is not implemented.');
  },
  deleteSecret: function (_secret: TSecret): Promise<void> {
    throw new Error('Function is not implemented.');
  },
});

interface SecretsProps {
  children: ReactNode;
}

export const SecretsProvider = ({ children }: SecretsProps) => {
  const [secrets, setSecrets] = useState<TSecret[] | null>(null);
  const [filteredSecrets, setFilteredSecrets] = useState<TSecret[] | null>(null);
  const [selectedSecret, setSelectedSecret] = useState<TSecret | null>(null);
  const [folders, setFolders] = useState<TFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<TFolder | null>(null);

  const { googleDriveState } = useGoogleDrive();
  const { t } = useTranslation('secrets');
  const authContext = useAuth();
  const { envs } = useEnvVars();

  const saveSecrets = async (secrets: TSecret[], folders: TFolder[]): Promise<void> => {
    const notificationId = toast.loading(t('data.updating'));

    const secretFile: TSecretFile = {
      version: SECRET_FILE_VERSION,
      folders,
      secrets,
    };
    const result = await uploadSecretFile(
      await encrypt(JSON.stringify(secretFile), authContext.secretPassword),
      envs,
      t,
      authContext,
    );

    if (!result) {
      toast.error(t('data.failed'));
      toast.dismiss(notificationId);
      return;
    }

    toast.success(t('data.updated'));
    toast.dismiss(notificationId);
  };

  const deleteSecret = async (secret: TSecret) => {
    if (!secrets) {
      return;
    }

    const newSecrets = secrets.filter((s) => s.id !== secret.id);
    setSecrets(newSecrets);
    setFilteredSecrets(newSecrets);
    await saveSecrets(newSecrets, folders);
  };

  useEffect(() => {
    setFolders([]);
  }, [googleDriveState]);

  const fetchSecrets = async () => {
    const notificationId = toast.loading(t('data.fetch.inProgress'));
    try {
      const response = await customFetch(
        `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
        null,
        'GET',
        t,
      );
      const secretFileResponse = await response?.text();
      if (!secretFileResponse) {
        toast.error(t('data.fetch.failed'));
        authContext.setSecretPassword('');
        toast.dismiss(notificationId);
        return;
      }

      console.log('test: ', authContext.secretPassword);
      const decryptedSecretFile = await decrypt(secretFileResponse, authContext.secretPassword);
      const secretFileInfo = JSON.parse(decryptedSecretFile) as TSecretFile;
      const migratedSecretFile = applyMigrations(secretFileInfo);
      console.log(migratedSecretFile); // TODO: remove debug logs
      const secrets = migratedSecretFile.secrets;
      const folders = migratedSecretFile.folders;

      setSecrets(secrets ?? null);
      setFilteredSecrets(secrets ?? null);
      setFolders(folders ?? []);
      authContext.closeSecretPasswordModal();
      toast.dismiss(notificationId);
    } catch (error) {
      console.error(error);
      toast.error(t('incorrectMasterPassword'));
      authContext.setSecretPassword('');
      toast.dismiss(notificationId);
    }
  };

  const contextValue = useMemo(
    () => ({
      secrets,
      filteredSecrets,
      selectedSecret,
      folders,
      selectedFolder,
      setSelectedFolder,
      setSelectedSecret,
      setFilteredSecrets,
      setSecrets,
      setFolders,
      saveSecrets,
      fetchSecrets,
      deleteSecret,
    }),
    [secrets, filteredSecrets, folders, selectedFolder, selectedSecret],
  );

  return <SecretsContext.Provider value={contextValue}>{children}</SecretsContext.Provider>;
};

export const useSecrets = () => {
  const context = useContext(SecretsContext);
  if (context === undefined) {
    throw new Error('useEnvVars must be used within an EnvVarsProvider');
  }
  return context;
};
