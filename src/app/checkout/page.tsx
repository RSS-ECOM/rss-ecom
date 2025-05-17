import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  description: 'Our checkout system is currently under development. Please check back soon!',
  title: 'Checkout Coming Soon | Story Hive',
};

export default function CheckoutPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Clock className="h-12 w-12 text-primary animate-pulse" />
        </div>

        <div className="relative w-full h-60 mb-8">
          <Image alt="Page under development" className="object-contain" fill priority src="/img/webp/dev.webp" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">Checkout Coming Soon</h1>

        <p className="text-muted-foreground mb-8 text-lg">
          We&apos;re currently working on implementing a seamless checkout experience for you. Please check back soon or
          continue shopping!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link className="flex items-center gap-2" href="/products">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/cart">View Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
