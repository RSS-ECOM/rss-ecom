'use client';

import { StyledInput } from '@/components/ui/StyledInput';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '@/hooks/use-customer';
import { useResponsiveToast } from '@/hooks/use-responsive-toast';
import useAuthStore from '@/store/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { PasswordInput } from '../registration-form/registration-form';

export default function LoginForm(): JSX.Element | null {
  const { toast } = useResponsiveToast();
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isLoginLoading, login } = useCustomer();
  const [isLoading, setIsLoading] = useState(true);

  const FormSchema = z.object({
    email: z
      .string()
      .email('Write a valid email address')
      .refine((val) => !/\s/.test(val), {
        message: 'Email address must not contain whitespace',
      }),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'Password cannot contain spaces',
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
    if (/\s/.test(data.email)) {
      toast({
        description: 'Email address contains whitespace. Please remove all spaces.',
        title: 'Validation Error',
        variant: 'destructive',
      });
      return;
    }
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
        className="border border-border p-6 md:p-8 rounded-xl w-full flex flex-wrap gap-x-4 gap-y-3 items-start justify-center bg-card/50 shadow-md dark:shadow-black/10"
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
        <div className="w-full">
          <h3 className="text-lg font-merriweather text-foreground/90 mb-3 h-accent">Account Login</h3>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow basis-full">
              <FormLabel className="font-medium text-foreground/90">Email</FormLabel>
              <FormControl>
                <StyledInput
                  placeholder="your.email@gmail.com"
                  type="text"
                  {...field}
                  className={/\s/.test(field.value || '') ? 'border-red-500 focus:border-red-500 bg-red-50/30' : ''}
                />
              </FormControl>
              {/\s/.test(field.value || '') && (
                <p className="text-xs font-medium text-red-500 mt-1">Email contains spaces! Please remove them.</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grow basis-full">
              <FormLabel className="font-medium text-foreground/90">Password</FormLabel>
              <FormControl>
                <PasswordInput field={field} placeholder="password" />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters and include uppercase, lowercase, and number.
              </p>
            </FormItem>
          )}
        />

        <Separator className="w-full my-6 bg-primary/20" />

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          disabled={isLoginLoading}
          type="submit"
        >
          {isLoginLoading ? (
            <span className="flex items-center justify-center">
              <span className="bee-loader mr-2 w-5 h-5 inline-block"></span>
              Logging in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="mt-4 text-center text-sm w-full">
          Don&apos;t have an account?{' '}
          <Link className="text-primary hover:underline underline-offset-4 font-medium" href="/sign-up">
            Sign up
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
