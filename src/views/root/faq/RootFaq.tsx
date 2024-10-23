import { Accordion, Container, Title } from '@mantine/core'
import classes from './RootFaq.module.css'

export function RootFaq() {
  return (
    <Container size='sm' className={classes.wrapper}>
      <Title ta='center' className={classes.title} mb={'xl'}>
        Frequently Asked Questions
      </Title>

      <Accordion variant='separated'>
        <Accordion.Item className={classes.item} value='secure'>
          <Accordion.Control>
            How secure is Immortal Vault for storing my passwords?
          </Accordion.Control>
          <Accordion.Panel>
            Immortal Vault uses strong encryption standards to ensure your passwords and personal
            data are kept secure and private.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value='multiple-devices'>
          <Accordion.Control>
            Can I access my saved credentials on multiple devices?
          </Accordion.Control>
          <Accordion.Panel>
            Yes, Immortal Vault supports synchronization across multiple devices, allowing you to
            access your passwords anywhere.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value='master-password'>
          <Accordion.Control>What happens if I forget my master password?</Accordion.Control>
          <Accordion.Panel>
            For security reasons, the master password is not recoverable. However, you can change it
            in account settings
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value='autofill'>
          <Accordion.Control>Does Immortal Vault support autofill for secrets?</Accordion.Control>
          <Accordion.Panel>
            At the moment this feature is under development, we realize how convenient and necessary
            it is for our users.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}
