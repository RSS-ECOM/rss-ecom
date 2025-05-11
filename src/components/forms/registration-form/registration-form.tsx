'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  billCity: z.string().min(1, 'Your bill city is required'),
  billPostalCode: z.string().min(1, 'Your bill postal code is required'),
  billSetDefault: z.boolean(),
  billStreet: z.string().min(1, 'Your bill street is required'),
  dateOfBirth: z.date({ required_error: 'Choose your birthday' }),
  email: z.string().email('Write a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters')
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    }),
  sameBillShip: z.boolean(),
  shipCity: z.string().min(1, 'Your ship city is required'),
  shipPostalCode: z.string().min(1, 'Your ship postal code is required'),
  shipSetDefault: z.boolean(),
  shipStreet: z.string().min(1, 'Your ship street is required'),
});

// eslint-disable-next-line max-lines-per-function
export default function RegistrationForm(): JSX.Element {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      billCity: '',
      billPostalCode: '',
      billSetDefault: true,
      billStreet: '',
      dateOfBirth: undefined,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      sameBillShip: true,
      shipCity: '',
      shipPostalCode: '',
      shipSetDefault: true,
      shipStreet: '',
    },
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast({
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      title: 'You submitted the following values:',
    });
  }

  return (
    <Form {...form}>
      <form
        className="border-2 p-4 rounded-xl w-[800px] flex flex-wrap gap-x-2.5 items-center justify-center space-y-6"
        onSubmit={(e) => {
          form
            .handleSubmit(onSubmit)(e)
            .catch((error) => {
              console.error('Form submission error:', error);
              toast({
                description: 'An error occurred during registration',
                title: 'Error',
                variant: 'destructive',
              });
            });
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow basis-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col grow basis-2/5">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      variant={'outline'}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billCity"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>Billing city</FormLabel>
              <FormControl>
                <Input placeholder="city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billPostalCode"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>Billing postal code</FormLabel>
              <FormControl>
                <Input placeholder="postal code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billStreet"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>Billing postal code</FormLabel>
              <FormControl>
                <Input placeholder="street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sameBillShip"
          render={({ field }) => (
            <FormItem className="grow basis-full flex flex-row items-end gap-1">
              <FormLabel>Use the same address as a billing and a shipping</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    const value = Boolean(checked);
                    field.onChange(value);

                    if (value) {
                      const billCity = form.getValues('billCity');
                      form.setValue('shipCity', billCity);
                    } else {
                      form.setValue('shipCity', '');
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billSetDefault"
          render={({ field }) => (
            <FormItem className="grow basis-full flex flex-row items-end gap-1">
              <FormLabel>
                {form.watch('sameBillShip')
                  ? 'Set as default billing & shipping address'
                  : 'Set as default billing address'}
              </FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {!form.watch('sameBillShip') && (
          <>
            <FormField
              control={form.control}
              name="shipCity"
              render={({ field }) => (
                <FormItem className="grow basis-2/5">
                  <FormLabel>Shipping city</FormLabel>
                  <FormControl>
                    <Input placeholder="city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipPostalCode"
              render={({ field }) => (
                <FormItem className="grow basis-2/5">
                  <FormLabel>Shipping postal code</FormLabel>
                  <FormControl>
                    <Input placeholder="postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipStreet"
              render={({ field }) => (
                <FormItem className="grow basis-2/5">
                  <FormLabel>Shipping postal code</FormLabel>
                  <FormControl>
                    <Input placeholder="street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipSetDefault"
              render={({ field }) => (
                <FormItem className="grow basis-2/5 flex flex-row items-end gap-1">
                  <FormLabel>Set as default shipping address</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grow basis-2/5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
