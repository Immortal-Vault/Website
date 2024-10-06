import { EPrimaryViewPage, ESettingsViewPage } from '../types'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

export interface MenuContextType {
  currentPage: EPrimaryViewPage
  settingsPage: ESettingsViewPage
  setCurrentPage: Dispatch<SetStateAction<EPrimaryViewPage>>
  setSettingsPage: Dispatch<SetStateAction<ESettingsViewPage>>
}

const MenuContext = createContext<MenuContextType>({
  currentPage: EPrimaryViewPage.Profile,
  settingsPage: ESettingsViewPage.Vault,
  setCurrentPage: function (): void {
    throw new Error('Function is not implemented.')
  },
  setSettingsPage: function (): void {
    throw new Error('Function is not implemented.')
  },
})

interface MenuProps {
  children: ReactNode
}

export const MenuProvider = ({ children }: MenuProps) => {
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)
  const [settingsPage, setSettingsPage] = useState(ESettingsViewPage.Main)

  const contextValue = useMemo(
    () => ({
      currentPage,
      settingsPage,
      setCurrentPage,
      setSettingsPage,
    }),
    [currentPage, settingsPage],
  )

  return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
}

export const useMenu = () => {
  return useContext(MenuContext)
}
