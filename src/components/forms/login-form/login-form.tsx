'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCustomer } from '@/hooks/use-customer';
import useAuthStore from '@/store/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm(): JSX.Element | null {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isLoginLoading, login } = useCustomer();
  const [isLoading, setIsLoading] = useState(true);

  const FormSchema = z.object({
    email: z.string().email('Write a valid email address'),
    password: z
      .string()
      .min(5, 'Password must be at least 5 characters')
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    login({
      email: data.email,
      password: data.password,
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isLoggedIn) {
        router.replace('/products');
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <form
        className="border-2 p-4 rounded-xl"
        onSubmit={(e) => {
          form
            .handleSubmit(onSubmit)(e)
            .catch((error) => {
              console.error('Form submission error:', error);
            });
        }}
      >
        <div className="flex flex-col gap-6">
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
          <Button className="w-full" disabled={isLoginLoading} type="submit">
            {isLoginLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link className="underline underline-offset-4" href="/sign-up">
            Sign up
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
