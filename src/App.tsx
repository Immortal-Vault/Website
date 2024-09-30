import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './views/auth/SignUp.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTER_PATH } from './shared'
import SignIn from './views/auth/SignIn.tsx'
import { ToastContainer, Zoom } from 'react-toastify'
import Primary from './views/primary/Primary.tsx'
import { ErrorBoundary, ErrorBoundaryError } from './components/errors'
import { useMediaQuery } from '@mantine/hooks'
import { ProtectedRoute } from './components/router/ProtectedRoute.tsx'
import { EnvVarsProvider, AuthProvider, GoogleDriveProvider } from './stores'
import { NonAuthorizedRoute } from './components/router/NonAuthorizedRoute.tsx'
import ApproveSignIn from './views/auth/ApproveSignIn.tsx'

const theme = createTheme({})

const router = createBrowserRouter([
  {
    path: ROUTER_PATH.ROOT,
    element: (
      <NonAuthorizedRoute>
        <SignIn />
      </NonAuthorizedRoute>
    ),
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
          <AuthProvider>
            <GoogleDriveProvider>
              <RouterProvider router={router} />
            </GoogleDriveProvider>
          </AuthProvider>
        </EnvVarsProvider>
      </MantineProvider>
    </ErrorBoundary>
  )
}
