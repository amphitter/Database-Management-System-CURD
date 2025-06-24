// frontend/src/components/AuthLayout.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '../lib/auth';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  return <>{children}</>;
}