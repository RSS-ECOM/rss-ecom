'use client';

import type { Customer } from '@commercetools/platform-sdk';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerClient } from '@/lib/customer-client';
import { useEffect, useState } from 'react';

export default function CustomerInfo(): JSX.Element {
  const { customerClient } = useCustomerClient();
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  useEffect(() => {
    if (customerClient) {
      customerClient.update();
      customerClient
        .getCustomerInfo()
        .then((response) => setCustomerData(response))
        .catch((error) => console.error(error));
    }
  }, [customerClient]);

  const getAddressTitle = (customerData: Customer, id: string | undefined): string => {
    if (customerData.defaultBillingAddressId === id) {
      return 'Default billing address';
    }
    if (customerData.defaultShippingAddressId === id) {
      return 'Default shipping Address';
    }
    return 'Additional address';
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            {customerData ? (
              <div>
                <p>Name: {customerData.firstName}</p>
                <p>Last name: {customerData.lastName}</p>
                <p>Date of birth: {customerData.dateOfBirth}</p>
              </div>
            ) : (
              <p>No data</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            {customerData ? (
              <div>
                {customerData.addresses.map((address) => (
                  <Card className="w-full mb-8" key={address.id}>
                    <CardHeader>
                      <CardTitle>{getAddressTitle(customerData, address.id)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Country: {address.country}</p>
                      <p>City: {address.city}</p>
                      <p>Postal Code: {address.postalCode}</p>
                      <p>Street: {address.streetName}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
