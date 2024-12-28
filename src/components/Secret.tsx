import { Anchor, Button, CopyButton, Flex, Group, Modal, Text, Title, Card } from '@mantine/core'
import {
  FaAddressCard,
  FaClock,
  FaExternalLinkAlt,
  FaLock,
  FaPhoneAlt,
  FaStickyNote,
  FaUserAlt,
} from 'react-icons/fa'
import { TSecret } from '../types'
import { useEffect, useState } from 'react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

export const Secret = (props: { secret: TSecret; delete: () => Promise<void> }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false)

  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    setShowPassword(false)
  }, [])

  return (
    <>
      <Modal
        centered
        opened={submitModalState}
        onClose={closeSubmitModal}
        size='sm'
        title='Are you sure? You cannot undo this action'
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Group mt='lg'>
          <Button variant='outline' onClick={closeSubmitModal}>
            Cancel
          </Button>
          <Button
            color='red'
            onClick={async () => {
              await props.delete()
              closeSubmitModal()
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <Card shadow='md' radius='md' padding='lg' withBorder w={!isMobile ? '90%' : '100%'}>
        <Group align='center' mb='xl'>
          <FaAddressCard size={24} />
          <Title order={3} c='white' style={{ wordBreak: 'break-word' }}>
            {props.secret.label}
          </Title>
        </Group>

        <Flex direction='column' gap='sm' mb='lg'>
          {props.secret.username && (
            <Group>
              <FaUserAlt size={18} />
              <Text c='gray'>Username:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.username}
              </Text>
            </Group>
          )}
          {props.secret.email && (
            <Group>
              <FaUserAlt size={18} />
              <Text c='gray'>Email:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.email}
              </Text>
            </Group>
          )}
          {props.secret.password && (
            <Group>
              <FaLock size={18} />
              <Text c='gray'>Password:</Text>
              <Text c='white' style={{ wordBreak: 'break-all' }}>
                {showPassword
                  ? props.secret.password
                  : Array.from({ length: props.secret.password.length }).map(() => '•')}
              </Text>
              <Button size='xs' variant='outline' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
              <CopyButton value={props.secret.password}>
                {({ copied, copy }) => (
                  <Button size='xs' color={copied ? 'teal' : 'blue'} onClick={copy}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </CopyButton>
            </Group>
          )}
          {props.secret.website && (
            <Group>
              <FaExternalLinkAlt size={18} />
              <Text c='gray'>Website:</Text>
              <Anchor
                href={
                  props.secret.website.startsWith('http')
                    ? props.secret.website
                    : `https://${props.secret.website}`
                }
                target='_blank'
                underline='always'
                style={{ wordBreak: 'break-word' }}
              >
                {props.secret.website}
              </Anchor>
            </Group>
          )}
          {props.secret.phone && (
            <Group>
              <FaPhoneAlt size={18} />
              <Text c='gray'>Phone:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.phone}
              </Text>
            </Group>
          )}
          {props.secret.notes && (
            <Group>
              <FaStickyNote size={18} />
              <Text c='gray'>Notes:</Text>
              <Text c='white' style={{ wordBreak: 'break-word' }}>
                {props.secret.notes}
              </Text>
            </Group>
          )}
        </Flex>

        <Flex direction='column' gap='sm'>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>
              Last Updated: {new Date(props.secret.lastUpdated).toLocaleString()}
            </Text>
          </Group>
          <Group>
            <FaClock size={18} />
            <Text c='gray'>Created: {new Date(props.secret.created).toLocaleString()}</Text>
          </Group>
        </Flex>

        <Group mt='lg'>
          <Button color='red' onClick={openSubmitModal}>
            Delete
          </Button>
        </Group>
      </Card>
    </>
  )
}
