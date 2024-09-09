import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './views/auth/SignUp.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTER_PATH } from './shared'
import SignIn from './views/auth/SignIn.tsx'
import { AuthProvider } from './stores/AuthContext.tsx'
import { ToastContainer, Zoom } from 'react-toastify'
import Primary from './views/primary/Primary.tsx'
import { ErrorBoundary, ErrorBoundaryError } from './components/errors'

const theme = createTheme({})

const router = createBrowserRouter([
  {
    path: ROUTER_PATH.ROOT,
    element: <SignIn />,
  },
  {
    path: ROUTER_PATH.SIGN_IN,
    element: <SignIn />,
  },
  {
    path: ROUTER_PATH.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: ROUTER_PATH.MAIN_MENU,
    element: <Primary />,
  },
])

export default function App() {
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
          draggable
          theme='dark'
          transition={Zoom}
        />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MantineProvider>
    </ErrorBoundary>
  )
}
