import { Button, Flex, Group, Text, Title } from '@mantine/core'
import { FaExternalLinkAlt, FaUserAlt, FaLock } from 'react-icons/fa'
import { TSecret } from '../types'

export const Secret = (props: { secret: TSecret }) => {
  return (
    <>
      <Group align='center' justify='space-between' mb='xl'>
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
          <Button variant='outline' size='xs' c='green'>
            Show
          </Button>
        </Group>
        <Group>
          <FaExternalLinkAlt />
          <Text c='gray'>Website:</Text>
          <Text component='a' href={props.secret.website} c='blue' target='_blank'>
            {props.secret.website}
          </Text>
        </Group>
      </Flex>
      <Flex direction='column'>
        <Text c='gray'>Last Updated: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
        <Text c='gray'>Created: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
      </Flex>
    </>
  )
}
