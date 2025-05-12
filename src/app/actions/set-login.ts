'use server';

import { cookies } from 'next/headers';

function setCookiesAsync(isAuthenticated: string): Promise<void> {
  return new Promise((resolve) => {
    cookies().set('login', isAuthenticated);
    resolve();
  });
}

export default async function setLogin(isAuthenticated: string): Promise<void> {
  await setCookiesAsync(isAuthenticated);
}
