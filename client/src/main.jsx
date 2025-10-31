import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeProvider.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';
import { setUser } from './redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import axios from './utils/axios';

const token = localStorage.getItem('token');

if (token) {
  try {
    const decoded = jwtDecode(token);

    // Check for expiry
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
    } else {
      axios.get('/api/profile')
        .then((res) => {
          store.dispatch(setUser(res.data.user));
        })
        .catch((err) => {
          console.error('Profile fetch failed:', err.message);
          localStorage.removeItem('token');
        });
    }
  } catch (err) {
    console.error('Invalid token:', err.message);
    localStorage.removeItem('token');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
