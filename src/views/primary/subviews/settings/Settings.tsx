import { ESettingsViewPage } from '../../../../types'
import { Main } from './Main.tsx'

const settingPages: any[] = [Main]

export const Settings = (props: { currentPage: ESettingsViewPage }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component />
}
