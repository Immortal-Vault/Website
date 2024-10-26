import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './views/auth/SignUp.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTER_PATH } from './shared'
import SignIn from './views/auth/SignIn.tsx'
import { ToastContainer, Zoom } from 'react-toastify'
import Primary from './views/primary/Primary.tsx'
import { ErrorBoundary, ErrorBoundaryError, NonAuthorizedRoute, ProtectedRoute } from './components'
import { useMediaQuery } from '@mantine/hooks'
import {
  EnvVarsProvider,
  AuthProvider,
  GoogleDriveProvider,
  MenuProvider,
  SecretsProvider,
} from './stores'
import ApproveSignIn from './views/auth/ApproveSignIn.tsx'
import Root from './views/root/Root.tsx'
import { PrivacyPolicy } from './views/root/privacy/PrivacyPolicy.tsx'

const theme = createTheme({})

const router = createBrowserRouter([
  {
    path: ROUTER_PATH.ROOT,
    element: <Root />,
  },
  {
    path: ROUTER_PATH.PRIVACY_POLICY,
    element: <PrivacyPolicy />,
  },
  {
    path: ROUTER_PATH.SIGN_IN,
    element: (
      <NonAuthorizedRoute>
        <SignIn />
      </NonAuthorizedRoute>
    ),
  },
  {
    path: ROUTER_PATH.SIGN_IN_APPROVE,
    element: (
      <NonAuthorizedRoute>
        <ApproveSignIn />
      </NonAuthorizedRoute>
    ),
  },
  {
    path: ROUTER_PATH.SIGN_UP,
    element: (
      <NonAuthorizedRoute>
        <SignUp />
      </NonAuthorizedRoute>
    ),
  },
  {
    path: ROUTER_PATH.MAIN_MENU,
    element: (
      <ProtectedRoute>
        <Primary />
      </ProtectedRoute>
    ),
  },
])

export default function App() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <MantineProvider theme={theme} defaultColorScheme={'dark'}>
        <ToastContainer
          position={isMobile ? 'bottom-center' : 'top-right'}
          autoClose={2500}
          limit={3}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme='dark'
          transition={Zoom}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
        <EnvVarsProvider>
          <MenuProvider>
            <AuthProvider>
              <GoogleDriveProvider>
                <SecretsProvider>
                  <RouterProvider router={router} />
                </SecretsProvider>
              </GoogleDriveProvider>
            </AuthProvider>
          </MenuProvider>
        </EnvVarsProvider>
      </MantineProvider>
    </ErrorBoundary>
  )
}
