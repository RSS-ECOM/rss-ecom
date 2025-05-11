'use server';

import { cookies } from 'next/headers';

export default function setLogin(isAuthenticated: string): void {
  cookies().set('login', isAuthenticated);
}
