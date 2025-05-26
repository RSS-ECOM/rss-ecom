'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useProductsByCategory } from '@/hooks/use-products';
import { useCustomerClient } from '@/lib/customer-client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

interface ProductListProps {
  categoryId?: string;
}

export default function ProductList({ categoryId }: ProductListProps): JSX.Element {
  const { customerClient } = useCustomerClient();

  useEffect(() => {
    if (customerClient) {
      customerClient.update();
    }
  }, [customerClient]);

  const allProducts = useProducts();
  const categoryProducts = useProductsByCategory(categoryId);

  const { error, isLoading, products } = categoryId ? categoryProducts : allProducts;

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
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow book-card" key={product.id}>
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
          </div>
          <CardHeader className="p-4 flex-grow">
            <CardTitle className="text-lg line-clamp-2">{product.name['en-US']}</CardTitle>
            <CardDescription className="line-clamp-3">
              {product.description?.['en-US'] || 'No description available'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full">
              <Link href={`/products/${product.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
