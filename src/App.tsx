import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './views/auth/SignUp.tsx'
import { Route, Router, Routes } from 'react-router-dom'
import { ROUTER_PATH } from './shared'
import SignIn from './views/auth/SignIn.tsx'
import { AuthProvider } from './stores/AuthContext.tsx'
import { ToastContainer, Zoom } from 'react-toastify'
import Primary from './views/primary/Primary.tsx'
import { ErrorBoundary, ErrorBoundaryError } from './errors'
import { initNavigator, postEvent } from '@telegram-apps/sdk-react'
import { useIntegration } from '@telegram-apps/react-router-integration'
import { useMemo } from 'react'

const theme = createTheme({})

export default function App() {
  const navigator = useMemo(() => initNavigator('app-navigation-state'), [])
  const [location, reactNavigator] = useIntegration(navigator)

  // eslint-disable-next-line camelcase
  postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
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
          <Router location={location} navigator={reactNavigator}>
            <Routes>
              <Route path={ROUTER_PATH.ROOT} element={<Primary />} />
              <Route path={ROUTER_PATH.SIGN_IN} element={<SignIn />} />
              <Route path={ROUTER_PATH.SIGN_UP} element={<SignUp />} />
              <Route path={ROUTER_PATH.MAIN_MENU} element={<Primary />} />
            </Routes>
          </Router>
        </AuthProvider>
      </MantineProvider>
    </ErrorBoundary>
  )
}
