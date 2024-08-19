import { AppShell, Burger, Group, Image, Skeleton } from '@mantine/core'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from '../../shared/constants.ts'
import { AuthContext } from '../../stores/AuthContext.tsx'
import { useDisclosure } from '@mantine/hooks'

export default function Primary() {
  const navigate = useNavigate()
  const context = useContext(AuthContext)!

  useEffect(() => {
    if (!context.authState) {
      navigate(ROUTER_PATH.SIGN_IN)
    }
  }, [context.authState])

  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Image
            src={'/logo.png'}
            width={'40px'}
            height={'40px'}
            style={{
              marginLeft: '75%',
            }}
            alt={'Immortal Vault'}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt='sm' animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  )
}
