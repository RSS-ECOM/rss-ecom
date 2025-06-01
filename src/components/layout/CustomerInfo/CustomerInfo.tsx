'use client';

import type { Address, Customer } from '@commercetools/platform-sdk';

import AddressForm from '@/components/forms/address-form/address-form';
import ChangePasswordForm from '@/components/forms/change-password-form/change-password-form';
import PersonalInfoForm from '@/components/forms/personal-info-form/personal-info-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerClient } from '@/lib/customer-client';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';

const countrySwitch = (country: string): string => {
  switch (country) {
    case 'CA':
      return 'Canada';
    case 'DE':
      return 'Germany';
    case 'FR':
      return 'France';
    case 'GB':
      return 'Great Britain';
    case 'US':
      return 'United States';
    default:
      return 'No data';
  }
};

export default function CustomerInfo(): JSX.Element {
  const { customerClient } = useCustomerClient();
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState<Address | undefined>(undefined);

  useEffect(() => {
    if (customerClient) {
      customerClient.update();
      customerClient
        .getCustomerInfo()
        .then((response) => setCustomerData(response))
        .catch((error) => console.error(error));
    }
  }, [customerClient]);

  useEffect(() => {
    if (customerData) {
      setDefaultShippingAddress(
        customerData.addresses.find((address) => address.id === customerData.defaultShippingAddressId),
      );
    }
  }, [customerData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressId, setAddressId] = useState('');

  const getAddressTitle = (customerData: Customer | null, id: string | undefined): string => {
    if (customerData) {
      if (customerData.defaultBillingAddressId === id) {
        return 'Default billing address';
      }
      if (customerData.defaultShippingAddressId === id) {
        return 'Default shipping Address';
      }
    } else {
      return 'No data';
    }
    return 'Additional address';
  };

  const handleEditPersonalInfoClick = (): void => {
    setModalOpen(true);
  };

  const handleChangePasswordClick = (): void => {
    setPasswordModalOpen(true);
  };

  const handleEditAddressClick = (id: string): void => {
    setAddressId(id);
    setAddressModalOpen(true);
  };

  const displayAddress = (address: Address, isEqual: boolean): JSX.Element => (
    <Card className="group relative w-full mb-8" key={address.id}>
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
        onClick={() => handleEditAddressClick(address.id ? address.id : '')}
      >
        <Edit className="h-5 w-5"></Edit>
      </button>
      <CardHeader>
        <CardTitle>
          {isEqual ? 'Default shipping Address' : getAddressTitle(customerData || null, address.id)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Country: {countrySwitch(address.country)}</p>
        <p>City: {address.city}</p>
        <p>Postal Code: {address.postalCode}</p>
        <p>Street: {address.streetName}</p>
      </CardContent>
    </Card>
  );

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
                {customerData.defaultShippingAddressId === customerData.defaultBillingAddressId &&
                defaultShippingAddress
                  ? displayAddress(defaultShippingAddress, true)
                  : ''}
                {customerData.addresses.map((address) => displayAddress(address, false))}
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
      <AddressForm
        addressId={addressId}
        customerData={customerData}
        modalOpen={addressModalOpen}
        setCustomerData={setCustomerData}
        setModalOpen={setAddressModalOpen}
      ></AddressForm>
    </div>
  );
}
