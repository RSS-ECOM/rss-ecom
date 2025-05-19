'use server';

import { cookies } from 'next/headers';

function setCookiesAsync(isAuthenticated: string): Promise<void> {
  return new Promise((resolve) => {
    cookies().set('login', isAuthenticated);
    resolve();
  });
}

export default async function setLogin(isAuthenticated: null | string): Promise<void> {
  if (isAuthenticated) {
    await setCookiesAsync(isAuthenticated);
  } else {
    cookies().delete('login');
  }
}
