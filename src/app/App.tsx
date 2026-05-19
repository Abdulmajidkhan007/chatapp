import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import AppRouter from './router';
import { lightTheme, darkTheme } from '../styles/muiTheme';
import { useAppSelector } from './hooks';
import { useAuth } from '../hooks/useAuth';
import ErrorBoundary from '../components/common/ErrorBoundary';
import '../styles/global.css';

const ThemedApp: React.FC = () => {
  const mode = useAppSelector((s) => s.theme.mode);
  useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <AppRouter />
      </AnimatePresence>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            fontFamily:   "'Inter', sans-serif",
            fontSize:     '0.875rem',
          },
        }}
      />
    </ThemeProvider>
  );
};

const isMissingConfig = !process.env.REACT_APP_FIREBASE_API_KEY;

const App: React.FC = () => {
  if (isMissingConfig) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center', background: '#0f1117', color: '#e2e8f0' }}>
        <div style={{ fontSize: 40 }}>⚙️</div>
        <h2 style={{ margin: 0, fontSize: 20 }}>Firebase config topilmadi</h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 14, maxWidth: 380 }}>
          Netlify → Site settings → Environment variables bo'limiga <strong>REACT_APP_FIREBASE_*</strong> o'zgaruvchilarini kiriting, so'ng <strong>Trigger deploy</strong> ni bosing.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemedApp />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
