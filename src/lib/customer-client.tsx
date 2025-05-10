'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import CustomerClient from '@/app/api/client';

interface ICustomerClientContext {
  customerClient: CustomerClient;
  setCustomerClient: (customer: CustomerClient) => void;
}

const defaultCustomerClient = new CustomerClient();

const CustomerClientContext = createContext<ICustomerClientContext>({
  customerClient: defaultCustomerClient,
  setCustomerClient: () => {},
});

export const useCustomerClient = () => useContext(CustomerClientContext);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customerClient, setCustomerClient] = useState<CustomerClient>(defaultCustomerClient);

  return (
    <CustomerClientContext.Provider value={{ customerClient, setCustomerClient }}>
      {children}
    </CustomerClientContext.Provider>
  );
}
