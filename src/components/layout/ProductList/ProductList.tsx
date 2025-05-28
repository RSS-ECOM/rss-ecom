'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useProductsByCategory } from '@/hooks/use-products';
import { useCustomerClient } from '@/lib/customer-client';
import { type ProductProjection } from '@commercetools/platform-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface ProductListProps {
  categoryId?: string;
}

// eslint-disable-next-line max-lines-per-function
export default function ProductList({ categoryId }: ProductListProps): JSX.Element {
  const { customerClient } = useCustomerClient();
  const clientInitialized = useRef(false);

  useEffect(() => {
    if (customerClient && !clientInitialized.current) {
      clientInitialized.current = true;
      customerClient.update();
    }
  }, [customerClient]);

  const allProducts = useProducts();
  const categoryProducts = useProductsByCategory(categoryId);

  const { error, isLoading, products } = categoryId ? categoryProducts : allProducts;

  const handleAddToCart = (): void => {
    // TBA
  };

  const formatPrice = (price: number, currencyCode = 'USD'): string =>
    new Intl.NumberFormat('en-US', {
      currency: currencyCode,
      style: 'currency',
    }).format(price / 100);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <Card className="overflow-hidden" key={index}>
              <div className="aspect-[3/4] relative bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Skeleton className="h-5 w-1/3" />
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">No products found</h3>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error
            ? `Error loading products: ${error.message}`
            : "We couldn't find any products in this category."}
        </p>
        <Button asChild>
          <Link href="/categories">Browse all categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: ProductProjection) => {
          const { prices = [] } = product.masterVariant;

          let hasDiscount = false;
          let originalPrice = 0;
          let discountedPrice = 0;
          let currencyCode = 'USD';

          if (prices.length > 0) {
            const mainPrice = prices[0];

            if (mainPrice?.value?.centAmount) {
              originalPrice = mainPrice.value.centAmount;
            }

            if (mainPrice?.value?.currencyCode) {
              currencyCode = mainPrice.value.currencyCode;
            }

            if (mainPrice?.discounted?.value?.centAmount) {
              hasDiscount = true;
              discountedPrice = mainPrice.discounted.value.centAmount;
            }
          }

          if (originalPrice === 0 && product.masterVariant.price) {
            const { price } = product.masterVariant;

            if ('value' in price && price.value && 'centAmount' in price.value) {
              originalPrice = price.value.centAmount;
            }

            if ('value' in price && price.value && 'currencyCode' in price.value) {
              currencyCode = price.value.currencyCode;
            }

            if (
              'discounted' in price &&
              price.discounted &&
              'value' in price.discounted &&
              price.discounted.value &&
              'centAmount' in price.discounted.value
            ) {
              hasDiscount = true;
              discountedPrice = price.discounted.value.centAmount;
            }
          }

          let pageCount = '';
          const pageCountAttr = product.masterVariant.attributes?.find((attr) => attr.name === 'pageCount');

          if (pageCountAttr && (typeof pageCountAttr.value === 'string' || typeof pageCountAttr.value === 'number')) {
            pageCount = String(pageCountAttr.value);
          }

          return (
            <Card
              className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow book-card h-full"
              key={product.id}
            >
              {/* cover */}
              <div className="aspect-[3/4] relative bg-muted">
                {product.masterVariant.images && product.masterVariant.images.length > 0 ? (
                  <Image
                    alt={product.name['en-US'] || ''}
                    className="object-cover"
                    fill
                    src={product.masterVariant.images[0].url}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}

                {/* sale */}
                {hasDiscount && (
                  <div className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-md text-xs font-semibold">
                    Sale
                  </div>
                )}
              </div>

              {/* desc */}
              <CardHeader className="p-4 flex-grow">
                {/* head */}
                <CardTitle className="text-lg h-12 line-clamp-2 mb-1">{product.name['en-US']}</CardTitle>

                {/* desc */}
                <CardDescription className="h-18 line-clamp-3 mb-4">
                  {product.description?.['en-US'] || 'No description available'}
                </CardDescription>

                <div className="flex flex-col gap-1 h-16">
                  {/* pages */}
                  {pageCount && <div className="text-sm text-muted-foreground">Pages: {pageCount}</div>}

                  {/* price */}
                  <div className="mt-1">
                    {hasDiscount && discountedPrice > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-destructive font-bold text-lg">
                          {formatPrice(discountedPrice, currencyCode)}
                        </span>
                        <span className="text-muted-foreground line-through text-sm">
                          {formatPrice(originalPrice, currencyCode)}
                        </span>
                      </div>
                    )}

                    {!hasDiscount && originalPrice > 0 && (
                      <div className="font-semibold text-lg">{formatPrice(originalPrice, currencyCode)}</div>
                    )}

                    {originalPrice <= 0 && <div className="text-muted-foreground">Price on request</div>}
                  </div>
                </div>
              </CardHeader>

              {/* btn */}
              <CardFooter className="p-4 pt-0 mt-auto">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button asChild className="font-medium" variant="outline">
                    <Link href={`/products/${product.id}`}>Details</Link>
                  </Button>
                  <Button className="font-medium" disabled={true} onClick={handleAddToCart}>
                    Buy
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
