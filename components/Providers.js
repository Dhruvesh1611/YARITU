// components/Providers.js

'use client';

import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../contexts/UIProvider';

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <UIProvider>
        {children}
      </UIProvider>
    </SessionProvider>
  );
}