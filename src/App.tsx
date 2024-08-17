import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './views/auth/SignUp.tsx'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTER_PATH } from './shared/constants.ts'
import SignIn from './views/auth/SignIn.tsx'
import { AuthProvider } from './stores/AuthContext.tsx'
import { ToastContainer, Zoom } from 'react-toastify'
import Primary from './views/primary/Primary.tsx'

const theme = createTheme({})

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <ToastContainer
        position='top-center'
        autoClose={2500}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        transition={Zoom}
      />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path={ROUTER_PATH.ROOT} element={<SignIn />} />
            <Route path={ROUTER_PATH.SIGN_IN} element={<SignIn />} />
            <Route path={ROUTER_PATH.SIGN_UP} element={<SignUp />} />
            <Route path={ROUTER_PATH.MAIN_MENU} element={<Primary />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </MantineProvider>
  )
}
