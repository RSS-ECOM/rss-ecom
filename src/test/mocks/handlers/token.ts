import { HttpResponse, http } from 'msw';

const token = {
  access_token: '',
  expires_in: 10800,
  refresh_token: '',
  scope: process.env.NEXT_PUBLIC_CTP_SCOPES?.split(' '),
  token_type: 'Bearer',
};

const handlers = [
  http.post(
    `${process.env.NEXT_PUBLIC_CTP_AUTH_URL}/oauth/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/anonymous/token`,
    () => HttpResponse.json(token),
  ),
  http.post(
    `${process.env.NEXT_PUBLIC_CTP_AUTH_URL}/oauth/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/customers/token`,
    () => HttpResponse.json(token),
  ),
];

export default handlers;
