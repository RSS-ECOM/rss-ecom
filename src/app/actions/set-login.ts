'use server';

import { cookies } from 'next/headers';

export default async function setLogin(isAuthenticated: string): Promise<void> {
  try {
    cookies().set('login', isAuthenticated);
  } catch (error) {
    console.error('Error setting authentication cookie:', error);
    throw new Error('Failed to set authentication state');
  }
}
