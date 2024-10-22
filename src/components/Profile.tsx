import { FC, forwardRef } from 'react'
import { Menu, rem, UnstyledButton } from '@mantine/core'
import { FaLock, FaUserAlt } from 'react-icons/fa'

// eslint-disable-next-line react/display-name
const ProfileButton = forwardRef<HTMLButtonElement>(({ ...others }, ref) => (
  <UnstyledButton ref={ref} {...others}>
    <FaUserAlt />
  </UnstyledButton>
))

export const ProfileAvatarWithMenu: FC = () => {
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
        <Menu.Label>{'json'}</Menu.Label>
        <Menu.Item
          leftSection={
            <FaLock
              style={{
                width: rem(14),
                height: rem(14),
              }}
            />
          }
          onClick={() => {
            //
          }}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={
            <FaLock
              style={{
                width: rem(14),
                height: rem(14),
              }}
            />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color='red'
          leftSection={
            <FaLock
              style={{
                width: rem(14),
                height: rem(14),
              }}
            />
          }
          onClick={() => {
            //
          }}
        >
          Exit
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
