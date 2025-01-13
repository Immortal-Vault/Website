import { createTheme, MantineProvider } from '@mantine/core';
import SignUp from './views/auth/SignUp.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTER_PATH } from './shared';
import SignIn from './views/auth/SignIn.tsx';
import { ToastContainer, Zoom } from 'react-toastify';
import { ErrorBoundary, ErrorPage, NonAuthorizedRoute, ProtectedRoute } from './components';
import { useMediaQuery } from '@mantine/hooks';
import { AuthProvider, EnvVarsProvider, GoogleDriveProvider, SecretsProvider } from './stores';
import Root from './views/root/Root.tsx';
import { PrivacyPolicy } from './views/root/privacy/PrivacyPolicy.tsx';
import { Suspense } from 'react';
import { Primary, Settings, Vault } from './views/primary';

const theme = createTheme({
  components: {
    TextInput: {
      defaultProps: {
        autoComplete: 'off',
        'data-1p-ignore': 'true',
        'data-lpignore': 'true',
        'data-protonpass-ignore': 'true',
        'data-bwignore': 'true',
        'data-enignore': 'true',
        'data-enpass-ignore': 'true',
      },
    },
    Input: {
      defaultProps: {
        autoComplete: 'off',
        'data-1p-ignore': 'true',
        'data-lpignore': 'true',
        'data-protonpass-ignore': 'true',
        'data-bwignore': 'true',
        'data-enignore': 'true',
        'data-enpass-ignore': 'true',
      },
    },
    PasswordInput: {
      defaultProps: {
        autoComplete: 'off',
        'data-1p-ignore': 'true',
        'data-lpignore': 'true',
        'data-protonpass-ignore': 'true',
        'data-bwignore': 'true',
        'data-enignore': 'true',
        'data-enpass-ignore': 'true',
      },
    },
    Select: {
      defaultProps: {
        autoComplete: 'off',
        'data-1p-ignore': 'true',
        'data-lpignore': 'true',
        'data-protonpass-ignore': 'true',
        'data-bwignore': 'true',
        'data-enignore': 'true',
        'data-enpass-ignore': 'true',
      },
    },
  },
});

const errorElement = <ErrorPage />;

const router = createBrowserRouter([
  {
    path: ROUTER_PATH.ROOT,
    element: <Root />,
    errorElement,
  },
  {
    path: ROUTER_PATH.PRIVACY_POLICY,
    element: <PrivacyPolicy />,
    errorElement,
  },
  {
    path: ROUTER_PATH.SIGN_IN,
    element: (
      <NonAuthorizedRoute>
        <SignIn />
      </NonAuthorizedRoute>
    ),
    errorElement,
  },
  {
    path: ROUTER_PATH.SIGN_UP,
    element: (
      <NonAuthorizedRoute>
        <SignUp />
      </NonAuthorizedRoute>
    ),
    errorElement,
  },
  {
    path: ROUTER_PATH.MENU,
    element: (
      <ProtectedRoute>
        <Primary />
      </ProtectedRoute>
    ),
    errorElement,
  },
  {
    path: ROUTER_PATH.MENU_SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    errorElement,
  },
  {
    path: ROUTER_PATH.MENU_VAULT,
    element: (
      <ProtectedRoute>
        <Vault />
      </ProtectedRoute>
    ),
    errorElement,
  },
]);

export default function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <ErrorBoundary>
        <ToastContainer
          position={isMobile ? 'bottom-center' : 'bottom-right'}
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
              <SecretsProvider>
                <Suspense fallback={null}>
                  <RouterProvider router={router} />
                </Suspense>
              </SecretsProvider>
            </GoogleDriveProvider>
          </AuthProvider>
        </EnvVarsProvider>
      </ErrorBoundary>
    </MantineProvider>
  );
}
