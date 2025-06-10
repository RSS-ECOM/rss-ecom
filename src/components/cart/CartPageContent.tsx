'use client';

import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomerClient } from '@/lib/customer-client';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const formatPrice = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(amount / 100);

export default function CartPageContent(): JSX.Element {
  const { cart, loading, refreshCart } = useCart();
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const { customerClient } = useCustomerClient();

  useEffect(() => {
    refreshCart().catch(console.error);
  }, [refreshCart]);

  const handleRemoveItem = async (lineItemId: string): Promise<void> => {
    setIsRemoving((prev) => ({ ...prev, [lineItemId]: true }));
    try {
      if (customerClient) {
        await customerClient.removeFromCart(lineItemId);
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving((prev) => ({ ...prev, [lineItemId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div className="flex gap-4" key={i}>
              <Skeleton className="h-32 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="mb-6 text-muted-foreground">Start shopping to add items to your cart.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = cart.lineItems.reduce((sum, item) => {
    const price = item.price.discounted ? item.price.discounted.value.centAmount : item.price.value.centAmount;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.lineItems.map((item) => {
            const productName = item.name['en-US'] || 'Untitled Product';
            const price = item.price.discounted ? item.price.discounted.value.centAmount : item.price.value.centAmount;
            const totalPrice = price * item.quantity;
            const imageUrl = item.variant.images?.[0]?.url;

            return (
              <Card className="p-4 flex flex-col sm:flex-row items-start gap-4" key={item.id}>
                <div className="relative h-32 w-24 flex-shrink-0">
                  {imageUrl ? (
                    <Image alt={productName} className="object-cover" fill src={imageUrl} />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link className="font-medium hover:underline" href={`/products/${item.productId}`}>
                    {productName}
                  </Link>

                  <div className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</div>

                  <div className="font-medium mt-2">{formatPrice(totalPrice)}</div>
                </div>

                <Button
                  disabled={isRemoving[item.id]}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => handleRemoveItem(item.id)}
                  size="icon"
                  variant="ghost"
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Button className="w-full mt-6">Proceed to Checkout</Button>

            <Link href="/">
              <Button className="w-full mt-4" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
