import { FC, forwardRef } from 'react'
import { Avatar, Menu, rem, UnstyledButton } from '@mantine/core'
import { ROUTER_PATH, sendSuccessNotification } from '../shared'
import { useNavigate } from 'react-router-dom'
import { MdOutlineSettings } from 'react-icons/md'
import { TiCloudStorage } from 'react-icons/ti'
import { ImExit } from 'react-icons/im'
import { BsPersonCircle } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../stores'

// eslint-disable-next-line react/display-name
const ProfileButton = forwardRef<HTMLButtonElement>(({ ...others }, ref) => {
  return (
    <UnstyledButton ref={ref} {...others}>
      <Avatar variant='transparent' radius='xl' size='lg' color='rgba(81,175, 255, 1)' />
    </UnstyledButton>
  )
})

const elementsData = [
  {
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
]

export const ProfileAvatarWithMenu: FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('root')
  const { authSignOut } = useAuth()

  const elements = elementsData.map((element) => (
    <Menu.Item
      key={element.title}
      leftSection={element.icon}
      onClick={() => {
        if (element.link) {
          navigate(element.link)
        }
      }}
    >
      {t(element.title)}
    </Menu.Item>
  ))

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
      <Menu.Target>
        <ProfileButton />
      </Menu.Target>
      <Menu.Dropdown>
        {/* TODO: add username here */}
        <Menu.Label>{'test'}</Menu.Label>
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
            authSignOut(false)
            sendSuccessNotification(t('auth:signOut:successful'))
          }}
        >
          {t('header.exit')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
