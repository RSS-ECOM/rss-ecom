import type { Client } from '@commercetools/ts-client';

import {
  type ByProjectKeyRequestBuilder,
  type Customer,
  type CustomerDraft,
  type CustomerSignInResult,
  type ProductProjectionPagedQueryResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

import { createCtpClient, createCustomerClient, projectKey } from './client-builder';

function isCustomer(obj: unknown): obj is CustomerSignInResult {
  return typeof obj === 'object';
}

export default class CustomerClient {
  private ctpClient: Client;

  private customerClient: Client | null = null;

  private customerRoot: ByProjectKeyRequestBuilder | null = null;

  constructor() {
    this.ctpClient = createCtpClient();
  }

  public async getProducts(): Promise<ProductProjectionPagedQueryResponse | null> {
    if (this.customerRoot) {
      const response = await this.customerRoot.productProjections().get().execute();
      return response.body;
    }
    return null;
  }

  public async login(email: string, password: string): Promise<Customer> {
    this.customerClient = createCustomerClient(email, password);
    this.customerRoot = createApiBuilderFromCtpClient(this.customerClient).withProjectKey({ projectKey });
    const response = await this.customerRoot.me().get().execute();
    return response.body;
  }

  public async register(customerParams: CustomerParams): Promise<CustomerSignInResult | null> {
    const customerData: CustomerDraft = {
      addresses: customerParams.addresses,
      dateOfBirth: customerParams.dateOfBirth,
      defaultBillingAddress: customerParams.defaultBillingAddress,
      defaultShippingAddress: customerParams.defaultShippingAddress,
      email: customerParams.email,
      firstName: customerParams.firstName,
      lastName: customerParams.lastName,
      password: customerParams.password,
    };

    const response = await this.ctpClient.execute({
      body: customerData,
      method: 'POST',
      uri: `/${projectKey}/me/signup`,
    });
    if (isCustomer(response.body)) {
      return response.body;
    }
    return null;
  }
}

interface Address {
  city: string;
  country: string;
}

interface CustomerParams {
  addresses: Address[];
  dateOfBirth: string;
  defaultBillingAddress: number;
  defaultShippingAddress: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
