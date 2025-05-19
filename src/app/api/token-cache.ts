import type { TokenCache, TokenStore } from '@commercetools/ts-client';

class MyTokenCache {
  public cachedToken: TokenStore;

  public refreshToken: string | undefined;

  public tokenCache: TokenCache;

  constructor() {
    this.cachedToken = {
      expirationTime: 0,
      token: '',
    };
    this.tokenCache = {
      get: (): TokenStore => this.cachedToken,
      set: (tokenStore: TokenStore): void => {
        this.cachedToken = tokenStore;
        this.refreshToken = tokenStore.refreshToken;
      },
    };
  }
}

const myTokenCache = new MyTokenCache();

export default myTokenCache;
