import { ESettingsViewPage } from '../../../../types'
import { Main } from './Main.tsx'
import { Vault } from './Vault.tsx'

const settingPages: any[] = [Main, Vault]

export const Settings = (props: { currentPage: ESettingsViewPage }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component />
}
