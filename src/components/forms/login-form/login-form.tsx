'use client';

import setLogin from '@/app/actions/set-login';
import myTokenCache from '@/app/api/token-cache';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { useCustomerClient } from '@/lib/customer-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm(): JSX.Element | null {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const { customerClient } = useCustomerClient();
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

  async function onSubmit(data: z.infer<typeof FormSchema>): Promise<void> {
    try {
      if (await customerClient.login(data.email, data.password)) {
        if (myTokenCache.refreshToken) {
          try {
            await setLogin(myTokenCache.refreshToken);
            login();
            toast({
              description: 'Successfully logged in',
              title: 'Welcome back!',
            });
            router.push('/products');
          } catch (tokenError) {
            console.error('Token error:', tokenError);
            toast({
              description: 'Failed to set login token',
              title: 'Authentication error',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            description: 'No authentication token received',
            title: 'Login failed',
            variant: 'destructive',
          });
        }
      } else {
        form.setValue('password', '');
        toast({
          description: 'Invalid credentials',
          title: 'Login failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      form.setValue('password', '');
      toast({
        description: error instanceof Error ? error.message : 'There is no such user',
        title: 'Invalid data',
        variant: 'destructive',
      });
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';

      if (isAuthenticated || isLoggedIn) {
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
              toast({
                description: 'An error occurred during login',
                title: 'Error',
                variant: 'destructive',
              });
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
          <Button className="w-full" type="submit">
            Login
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
