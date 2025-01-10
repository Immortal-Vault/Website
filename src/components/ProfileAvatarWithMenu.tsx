import { FC, forwardRef } from 'react';
import { Avatar, Button, Group, Menu, Modal, rem, UnstyledButton } from '@mantine/core';
import { ROUTER_PATH, sendNotification, sendSuccessNotification } from '../shared';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSettings } from 'react-icons/md';
import { TiCloudStorage } from 'react-icons/ti';
import { ImExit } from 'react-icons/im';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useAuth, useGoogleDrive } from '../stores';
import { useDisclosure } from '@mantine/hooks';

// eslint-disable-next-line react/display-name
const ProfileButton = forwardRef<HTMLButtonElement>(({ ...others }, ref) => {
  return (
    <UnstyledButton ref={ref} {...others}>
      <Avatar variant='transparent' radius='xl' size='lg' color='rgba(81,175, 255, 1)' />
    </UnstyledButton>
  );
});

const elementsData = [
  {
    id: 'profile',
    title: 'header.profile',
    link: ROUTER_PATH.MENU,
    icon: (
      <BsPersonCircle
        style={{
          width: rem(20),
          height: rem(20),
        }}
      />
    ),
  },
  {
    id: 'settings',
    title: 'header.settings',
    link: ROUTER_PATH.MENU_SETTINGS,
    icon: (
      <MdOutlineSettings
        style={{
          width: rem(20),
          height: rem(20),
        }}
      />
    ),
  },
  {
    id: 'vault',
    title: 'header.vault',
    link: ROUTER_PATH.MENU_VAULT,
    icon: (
      <TiCloudStorage
        style={{
          width: rem(20),
          height: rem(20),
        }}
      />
    ),
  },
];

export const ProfileAvatarWithMenu: FC = () => {
  const [exitModalState, { open: openExitModal, close: closeExitModal }] = useDisclosure(false);
  const navigate = useNavigate();
  const { t } = useTranslation('root');
  const { authUsername, authSignOut } = useAuth();
  const { doesGoogleDriveConnected } = useGoogleDrive();

  const elements = elementsData.map((element) => (
    <Menu.Item
      key={element.title}
      leftSection={element.icon}
      onClick={() => {
        if (element.id === 'profile') {
          if (!doesGoogleDriveConnected()) {
            navigate(ROUTER_PATH.MENU_VAULT);
            sendNotification(t('notifications:needConnectVault'));
            return;
          }
        }
        if (element.link) {
          navigate(element.link);
        }
      }}
    >
      {t(element.title)}
    </Menu.Item>
  ));

  return (
    <Menu
      withArrow
      trigger='click-hover'
      keepMounted={false}
      withinPortal={false}
      trapFocus={false}
      closeDelay={20}
      defaultOpened={false}
    >
      <Modal
        centered={true}
        opened={exitModalState}
        onClose={closeExitModal}
        size='auto'
        title={t('modals.logout.title')}
        closeOnClickOutside={true}
        closeOnEscape={true}
        withCloseButton={true}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Group mt='xl' justify={'end'}>
          <Button
            variant={'filled'}
            onClick={() => {
              closeExitModal();
            }}
          >
            {t('modals.logout.buttons.cancel')}
          </Button>
          <Button
            variant={'outline'}
            color={'red'}
            onClick={async () => {
              await authSignOut(false);
              sendSuccessNotification(t('auth:signOut:successful'));
            }}
          >
            {t('modals.logout.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Menu.Target>
        <ProfileButton />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{authUsername}</Menu.Label>
        {elements}
        <Menu.Divider />
        <Menu.Item
          color='red'
          leftSection={
            <ImExit
              style={{
                width: rem(18),
                height: rem(18),
              }}
            />
          }
          onClick={() => {
            openExitModal();
          }}
        >
          {t('header.exit')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
