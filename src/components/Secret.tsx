import { Anchor, Button, Flex, Group, Text, Title } from '@mantine/core'
import { FaExternalLinkAlt, FaUserAlt, FaLock, FaAddressCard, FaClock } from 'react-icons/fa'
import { TSecret } from '../types'
import { useEffect, useState } from 'react'

export const Secret = (props: { secret: TSecret }) => {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setShowPassword(false)
  }, [])

  return (
    <>
      <Group align='center' mb='xl'>
        <FaAddressCard />
        <Title order={3}>{props.secret.label}</Title>
      </Group>
      <Flex direction='column' mb='xl'>
        <Group>
          <FaUserAlt />
          <Text c='gray'>Username:</Text>
          <Text c='white'>{props.secret.username}</Text>
        </Group>
        <Group>
          <FaLock />
          <Text c='gray'>Password:</Text>
          {showPassword && props.secret.password}
          <Button size='xs' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </Group>
        {props.secret.website && (
          <Group>
            <FaExternalLinkAlt />
            <Text c='gray'>Website:</Text>
            <Anchor
              href={
                props.secret.website.startsWith('http')
                  ? props.secret.website
                  : `https://${props.secret.website}`
              }
              target='_blank'
              underline={'never'}
            >
              {props.secret.website}
            </Anchor>
          </Group>
        )}
      </Flex>
      <Flex direction='column'>
        <Group>
          <FaClock />
          <Text c='gray'>Last Updated: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
        </Group>
        <Group>
          <FaClock />
          <Text c='gray'>Created: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
        </Group>
      </Flex>
    </>
  )
}
