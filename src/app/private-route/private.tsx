'use client';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

interface PrivateProps {
  children: ReactNode;
}

export default function Private({ children }: PrivateProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className='w-full bg-black text-md text-white'>LOADING...</div>;
  }

  if (status === 'unauthenticated' || !session) {
    redirect('/login');
  }

  return <>{children}</>;
}