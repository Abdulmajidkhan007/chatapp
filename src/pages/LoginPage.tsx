import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { signIn, signUp, clearError } from '../features/auth/authSlice';
import AuthLayout from '../layouts/AuthLayout';
import AuthForm from '../components/auth/AuthForm';
import { useState } from 'react';

const LoginPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, loading, error } = useAppSelector((s) => s.auth);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (data: { email: string; password: string; displayName?: string }) => {
    let result;
    if (mode === 'login') {
      result = await dispatch(signIn({ email: data.email, password: data.password }));
    } else {
      result = await dispatch(signUp({ email: data.email, password: data.password, displayName: data.displayName! }));
    }
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(from, { replace: true });
    }
  };

  const toggle = () => {
    dispatch(clearError());
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  };

  return (
    <AuthLayout
      title={mode === 'login' ? 'Welcome back' : 'Create account'}
      subtitle={mode === 'login' ? 'Sign in to continue' : 'Join the conversation'}
    >
      <AnimatePresence mode="wait">
        <AuthForm
          key={mode}
          mode={mode}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onToggle={toggle}
          onClearError={() => dispatch(clearError())}
        />
      </AnimatePresence>
    </AuthLayout>
  );
};

export default LoginPage;
