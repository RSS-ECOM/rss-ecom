import type { Customer } from '@commercetools/platform-sdk';
import type { ErrorResponse } from '@commercetools/platform-sdk';
import type { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCustomerClient } from '@/lib/customer-client';

type propsType = {
  customerData: Customer | null;
  modalOpen: boolean | undefined;
  setCustomerData: Dispatch<SetStateAction<Customer | null>>;
  setModalOpen: (value: SetStateAction<boolean>) => void;
};

function isError(error: unknown): error is ErrorResponse {
  return typeof error === 'object';
}

export default function PersonalInfoForm(props: propsType): JSX.Element | null {
  const { toast } = useToast();
  const { customerClient } = useCustomerClient();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name');
    let name = '';
    let email = '';
    let lastName = '';
    let dateOfBirth = '';
    if (nameInput instanceof HTMLInputElement) {
      name = nameInput.value;
    }
    const emailInput = form.elements.namedItem('email');
    if (emailInput instanceof HTMLInputElement) {
      email = emailInput.value;
    }
    const lastNameInput = form.elements.namedItem('last-name');
    if (lastNameInput instanceof HTMLInputElement) {
      lastName = lastNameInput.value;
    }
    const dateOfBirthInput = form.elements.namedItem('date-of-birth');
    if (dateOfBirthInput instanceof HTMLInputElement) {
      dateOfBirth = dateOfBirthInput.value;
    }
    try {
      await customerClient.updatePersonalInfo({ dateOfBirth, email, firstName: name, lastName });
      props.setCustomerData((prev) => (prev ? { ...prev, dateOfBirth, email, firstName: name, lastName } : null));
      toast({
        description: 'Customer updated!',
        title: 'Success',
      });
    } catch (error) {
      if (isError(error)) {
        toast({
          description: error.message,
          title: 'Error!',
          variant: 'destructive',
        });
      }
    }
  };
  return (
    <Dialog onOpenChange={props.setModalOpen} open={props.modalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="email">
              E-mail
            </Label>
            <Input className="col-span-3" defaultValue={props.customerData?.email} id="email" name="email" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" defaultValue={props.customerData?.firstName} id="name" name="name" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="last-name">
              Last name
            </Label>
            <Input className="col-span-3" defaultValue={props.customerData?.lastName} id="last-name" name="last-name" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="col-span-1 text-right" htmlFor="date-of-birth">
              Date of birth
            </Label>
            <Input
              className="col-span-3"
              defaultValue={props.customerData?.dateOfBirth}
              name="date-of-birth"
              type="date"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
