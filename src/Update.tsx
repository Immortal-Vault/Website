// import { CHANNELS } from './shared/constants'
// import { useEffect, useState } from 'react'
// import { Button, Dialog, Flex, Group, Progress, Text } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'

export default function Update() {
  // const [opened, { toggle, close }] = useDisclosure(false)
  // const [newVersion, setNewVersion] = useState('')
  // const [downloadUrl, setDownloadUrl] = useState('')
  // const [progress, setProgress] = useState('')

  // useEffect(() => {
  //   ipcRenderer.on(CHANNELS.NEW_UPDATE, (event, args) => {
  //     if (!args.available) {
  //       return
  //     }
  //
  //     setNewVersion(args.version)
  //     setDownloadUrl(args.downloadUrl)
  //     toggle()
  //   })
  //
  //   ipcRenderer.send(CHANNELS.NEW_UPDATE)
  //
  //   ipcRenderer.on(CHANNELS.UPDATE_PROGRESS, (event, args) => {
  //     setProgress(args.progress)
  //   })
  //   return () => {
  //     ipcRenderer.removeAllListeners(CHANNELS.NEW_UPDATE)
  //   }
  // }, [])

  // const triggerUpdate = () => {
  //   ipcRenderer.send(CHANNELS.TRIGGER_UPDATE, downloadUrl)
  //   setInterval(() => {
  //     ipcRenderer.send(CHANNELS.UPDATE_PROGRESS)
  //   }, 100)
  // }

  return (
    <>
      {/*<Dialog opened={opened} withCloseButton onClose={close} size='lg' radius='md'>*/}
      {/*  <Text size='sm' mb='xs' fw={500}>*/}
      {/*    Update available*/}
      {/*  </Text>*/}

      {/*  <Group align='flex-end'>*/}
      {/*    {progress === '' ? (*/}
      {/*      <>*/}
      {/*        <Text size='sm' mb='xs' fw={500}>*/}
      {/*          Do you want update Immortal Vault to version {newVersion}?*/}
      {/*        </Text>*/}
      {/*        /!*<Button onClick={triggerUpdate}>Yes</Button>*!/*/}
      {/*        <Button onClick={close}>No</Button>*/}
      {/*      </>*/}
      {/*    ) : (*/}
      {/*      <>*/}
      {/*        <Flex direction={'column'}>*/}
      {/*          <Text size='sm' mb='xs' fw={500}>*/}
      {/*            Update downloading in progress*/}
      {/*          </Text>*/}
      {/*          <Progress radius='xl' value={+progress} animated />*/}
      {/*        </Flex>*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*  </Group>*/}
      {/*</Dialog>*/}
    </>
  )
}
