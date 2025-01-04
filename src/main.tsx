import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import '@mantine/core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './locale';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
