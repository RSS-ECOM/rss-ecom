'use client';

import { StyledInput } from '@/components/ui/StyledInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '@/hooks/use-customer';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z
  .object({
    billCity: z.string().min(1, 'Your bill city is required'),
    billCountry: z.string().min(1, 'Country is required'),
    billPostalCode: z.string().min(1, 'Your bill postal code is required'),
    billSetDefault: z.boolean(),
    billStreet: z.string().min(1, 'Your bill street is required'),
    confirmPassword: z.string(),
    dateOfBirth: z
      .date({
        invalid_type_error: 'Choose a valid date',
        required_error: 'Choose your birthday',
      })
      .nullable(),
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
    shipCity: z.string().optional(),
    shipCountry: z.string().optional(),
    shipPostalCode: z.string().optional(),
    shipSetDefault: z.boolean(),
    shipStreet: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.sameBillShip) {
        return true;
      }

      return (
        !!data.shipCity &&
        data.shipCity.length > 0 &&
        !!data.shipCountry &&
        data.shipCountry.length > 0 &&
        !!data.shipPostalCode &&
        data.shipPostalCode.length > 0 &&
        !!data.shipStreet &&
        data.shipStreet.length > 0
      );
    },
    {
      message: 'Shipping address fields are required when using different addresses',
      path: ['shipCity'],
    },
  );

// eslint-disable-next-line max-lines-per-function
export default function RegistrationForm(): JSX.Element {
  const { isRegisterLoading, register } = useCustomer();
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      billCity: '',
      billCountry: 'US',
      billPostalCode: '',
      billSetDefault: true,
      billStreet: '',
      confirmPassword: '',
      dateOfBirth: new Date('2000-01-01'),
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      sameBillShip: true,
      shipCity: '',
      shipCountry: 'US',
      shipPostalCode: '',
      shipSetDefault: true,
      shipStreet: '',
    },
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    const customerParams = {
      addresses: [
        {
          city: data.billCity,
          country: data.billCountry,
          postalCode: data.billPostalCode,
          streetName: data.billStreet,
        },
      ],
      dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : '2000-01-01',
      defaultBillingAddress: data.billSetDefault ? 0 : 0,
      defaultShippingAddress: data.sameBillShip ? 0 : 1,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };

    if (!data.sameBillShip) {
      const shipCity = data.shipCity || data.billCity;
      const shipCountry = data.shipCountry || data.billCountry;
      const shipPostalCode = data.shipPostalCode || data.billPostalCode;
      const shipStreet = data.shipStreet || data.billStreet;

      customerParams.addresses.push({
        city: shipCity || '',
        country: shipCountry || 'US',
        postalCode: shipPostalCode || '',
        streetName: shipStreet || '',
      });
    }

    register(customerParams);
  }

  return (
    <Form {...form}>
      <form
        className="border border-border mb-6 p-6 md:p-8 rounded-xl w-full max-w-[800px] flex flex-wrap gap-x-4 gap-y-3 items-start justify-center bg-card/50 shadow-md dark:shadow-black/10"
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
        <div className="w-full">
          <h3 className="text-lg font-merriweather text-foreground/90 mb-3 h-accent">Personal Information</h3>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <StyledInput placeholder="your.email@gmail.com" type="email" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>First name</FormLabel>
              <FormControl>
                <StyledInput placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <StyledInput placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col grow basis-full sm:basis-2/5">
              <FormLabel className="mb-2.5">Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(
                        'w-full sm:w-[240px] pl-3 text-left font-normal border-input bg-background/50 hover:bg-accent/10',
                        !field.value && 'text-muted-foreground',
                      )}
                      variant={'outline'}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="p-3 border-b flex justify-between">
                    <select
                      className="text-sm border rounded px-2 py-1"
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value, 10);
                        const currentDate = field.value || new Date();
                        const newDate = new Date(currentDate);
                        newDate.setFullYear(newYear);
                        field.onChange(newDate);
                      }}
                      value={field.value ? new Date(field.value).getFullYear() : 2000}
                    >
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={2010 - i}>
                          {2010 - i}
                        </option>
                      ))}
                    </select>
                    <select
                      className="text-sm border rounded px-2 py-1"
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value, 10);
                        const currentDate = field.value || new Date();
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newMonth);
                        field.onChange(newDate);
                      }}
                      value={field.value ? new Date(field.value).getMonth() : 0}
                    >
                      {[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ].map((month, i) => (
                        <option key={i} value={i}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Calendar
                    className="bg-background border rounded-md"
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value || undefined}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full mt-4">
          <h3 className="text-lg font-merriweather text-foreground/90 mb-3 h-accent">Billing Address</h3>
        </div>

        <FormField
          control={form.control}
          name="billCountry"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Billing Country</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billCity"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Billing city</FormLabel>
              <FormControl>
                <StyledInput placeholder="city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billPostalCode"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Billing postal code</FormLabel>
              <FormControl>
                <StyledInput placeholder="postal code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billStreet"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Billing street</FormLabel>
              <FormControl>
                <StyledInput placeholder="street" {...field} />
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
                      const billCountry = form.getValues('billCountry');
                      const billStreet = form.getValues('billStreet');
                      const billPostalCode = form.getValues('billPostalCode');

                      form.setValue('shipCity', billCity);
                      form.setValue('shipCountry', billCountry);
                      form.setValue('shipStreet', billStreet);
                      form.setValue('shipPostalCode', billPostalCode);
                    } else {
                      form.setValue('shipCity', '');
                      form.setValue('shipCountry', '');
                      form.setValue('shipStreet', '');
                      form.setValue('shipPostalCode', '');
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

        <Separator className="w-full my-6 bg-primary/20" />

        {!form.watch('sameBillShip') && (
          <>
            <FormField
              control={form.control}
              name="shipCountry"
              render={({ field }) => (
                <FormItem className="grow basis-full sm:basis-2/5">
                  <FormLabel>Shipping Country</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipCity"
              render={({ field }) => (
                <FormItem className="grow basis-full sm:basis-2/5">
                  <FormLabel>Shipping city</FormLabel>
                  <FormControl>
                    <StyledInput placeholder="city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipPostalCode"
              render={({ field }) => (
                <FormItem className="grow basis-full sm:basis-2/5">
                  <FormLabel>Shipping postal code</FormLabel>
                  <FormControl>
                    <StyledInput placeholder="postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipStreet"
              render={({ field }) => (
                <FormItem className="grow basis-full sm:basis-2/5">
                  <FormLabel>Shipping postal code</FormLabel>
                  <FormControl>
                    <StyledInput placeholder="street" {...field} />
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

        <div className="w-full mt-4">
          <h3 className="text-lg font-merriweather text-foreground/90 mb-3 h-accent">Security</h3>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <StyledInput placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grow basis-full sm:basis-2/5">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <StyledInput placeholder="confirm password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="w-full my-6 bg-primary/20" />

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          disabled={isRegisterLoading}
          type="submit"
        >
          {isRegisterLoading ? (
            <span className="flex items-center justify-center">
              <span className="bee-loader mr-2 w-5 h-5 inline-block"></span>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
