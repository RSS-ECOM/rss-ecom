'use client';

import setLogin from '@/app/actions/set-login';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useCustomerClient } from '@/lib/customer-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm(): JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const { customerClient } = useCustomerClient();
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
    if (await customerClient.login(data.email, data.password)) {
      setLogin('true');
      router.push('/products');
    } else {
      toast({
        description: 'There is no such user',
        title: 'Invalid data',
      });
    }
  }
  useEffect(() => {
    if (sessionStorage.getItem('authenticated')) {
      router.replace('/products');
    }
  }, [pathname, router]);

  return (
    <FormProvider {...form}>
      <form className="border-2 p-4 rounded-xl" onSubmit={form.handleSubmit(onSubmit)}>
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
