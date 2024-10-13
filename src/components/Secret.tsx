import { Anchor, Button, CopyButton, Flex, Group, Modal, Text, Title } from '@mantine/core'
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
import { useDisclosure } from '@mantine/hooks'

export const Secret = (props: { secret: TSecret; delete: () => void }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [submitModalState, { open: openSubmitModal, close: closeSubmitModal }] =
    useDisclosure(false)

  useEffect(() => {
    setShowPassword(false)
  }, [])

  return (
    <>
      <Modal
        centered={true}
        opened={submitModalState}
        onClose={closeSubmitModal}
        size='auto'
        title={'Are you sure? You can not undo this'}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeSubmitModal()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              closeSubmitModal()
              props.delete()
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <Group align='center' mb='xl'>
        <FaAddressCard />
        <Title order={3}>{props.secret.label}</Title>
      </Group>
      <Flex direction='column' mb={'md'}>
        {props.secret.username && (
          <Group>
            <FaUserAlt />
            <Text c='gray'>Username:</Text>
            <Text c='white'>{props.secret.username}</Text>
          </Group>
        )}
        {props.secret.email && (
          <Group>
            <FaUserAlt />
            <Text c='gray'>Email:</Text>
            <Text c='white'>{props.secret.email}</Text>
          </Group>
        )}
        {props.secret.password && (
          <Group>
            <FaLock />
            <Text c='gray'>Password:</Text>
            {showPassword && props.secret.password}

            <Button size={'xs'} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
            <CopyButton value={props.secret.password}>
              {({ copied, copy }) => (
                <Button size={'xs'} color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Password copied' : 'Copy password'}
                </Button>
              )}
            </CopyButton>
          </Group>
        )}
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
        {props.secret.phone && (
          <Group>
            <FaPhoneAlt />
            <Text c='gray'>Phone:</Text>
            <Text c='white'>{props.secret.phone}</Text>
          </Group>
        )}
        {props.secret.notes && (
          <Group>
            <FaStickyNote />
            <Text c='gray'>Notes:</Text>
            <Text c='white'>{props.secret.notes}</Text>
          </Group>
        )}
      </Flex>
      <Flex direction='column'>
        <Group>
          <FaClock />
          <Text c='gray'>Last Updated: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
        </Group>
        <Group mb={'md'}>
          <FaClock />
          <Text c='gray'>Created: {new Date(props.secret.lastUpdated).toLocaleString()}</Text>
        </Group>
        <Button onClick={openSubmitModal}>Delete</Button>
      </Flex>
    </>
  )
}
