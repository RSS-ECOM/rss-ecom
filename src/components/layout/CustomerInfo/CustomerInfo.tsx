'use client';

import type { Customer } from '@commercetools/platform-sdk';

import ChangePasswordForm from '@/components/forms/change-password-form/change-password-form';
import PersonalInfoForm from '@/components/forms/personal-info-form/personal-info-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerClient } from '@/lib/customer-client';
import { Edit } from 'lucide-react';
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

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const getAddressTitle = (customerData: Customer, id: string | undefined): string => {
    if (customerData.defaultBillingAddressId === id) {
      return 'Default billing address';
    }
    if (customerData.defaultShippingAddressId === id) {
      return 'Default shipping Address';
    }
    return 'Additional address';
  };

  const handleEditPersonalInfoClick = (): void => {
    setModalOpen(true);
  };

  const handleChangePasswordClick = (): void => {
    setPasswordModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="group relative w-full max-w-xl">
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
              onClick={handleEditPersonalInfoClick}
            >
              <Edit className="h-5 w-5"></Edit>
            </button>
            {customerData ? (
              <div>
                <p>E-mail: {customerData.email}</p>
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
      <Card className="group relative w-full max-w-xl">
        <CardHeader>
          <CardTitle>Password change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            <Button onClick={handleChangePasswordClick}>Change Password</Button>
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
      <PersonalInfoForm
        customerData={customerData}
        modalOpen={modalOpen}
        setCustomerData={setCustomerData}
        setModalOpen={setModalOpen}
      ></PersonalInfoForm>
      <ChangePasswordForm
        customerData={customerData}
        modalOpen={passwordModalOpen}
        setCustomerData={setCustomerData}
        setModalOpen={setPasswordModalOpen}
      ></ChangePasswordForm>
    </div>
  );
}
