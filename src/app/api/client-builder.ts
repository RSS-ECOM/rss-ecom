import {
  type AuthMiddlewareOptions,
  type Client,
  ClientBuilder,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
} from '@commercetools/ts-client';

const scopes: string[] = process.env.NEXT_PUBLIC_CTP_SCOPES.split(' ');
export const projectKey: string = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY;

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.NEXT_PUBLIC_CTP_API_URL,
  httpClient: fetch,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  credentials: {
    clientId: process.env.NEXT_PUBLIC_CTP_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET,
  },
  host: process.env.NEXT_PUBLIC_CTP_AUTH_URL,
  httpClient: fetch,
  projectKey,
  scopes,
};

export const createCustomerClient = (email: string, password: string): Client => {
  const authMiddlewareOptionsToLogin: PasswordAuthMiddlewareOptions = {
    credentials: {
      clientId: process.env.NEXT_PUBLIC_CTP_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET,
      user: {
        password,
        username: email,
      },
    },
    host: process.env.NEXT_PUBLIC_CTP_AUTH_URL,
    httpClient: fetch,
    projectKey,
    scopes,
  };
  return new ClientBuilder()
    .withPasswordFlow(authMiddlewareOptionsToLogin)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
};

export const createCtpClient = (): Client => {
  const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
  return ctpClient;
};
