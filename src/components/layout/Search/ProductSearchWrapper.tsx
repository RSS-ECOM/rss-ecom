/* eslint-disable no-console */

'use client';

import ProductList from '@/components/layout/ProductList/ProductList';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomerClient } from '@/lib/customer-client';
import { type ProductProjection } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';

interface ProductSearchWrapperProps {
  categoryId?: string;
  searchQuery?: null | string;
}

export default function ProductSearchWrapper({ categoryId, searchQuery }: ProductSearchWrapperProps): JSX.Element {
  const { customerClient } = useCustomerClient();
  const [searchResults, setSearchResults] = useState<ProductProjection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!searchQuery || !customerClient) {
      setSearchResults([]);
      setError(null);
      return;
    }

    const fetchSearchResults = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        if (searchQuery.length < 2) {
          console.log('Search query too short, skipping API call');
          setSearchResults([]);
          return;
        }

        const response = await customerClient.searchProducts(searchQuery);

        console.log(
          `Search completed for "${searchQuery}"`,
          response ? `Found ${response.results?.length || 0} results` : 'No response',
        );

        if (response && response.results) {
          setSearchResults(response.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error searching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to search products'));

        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults().catch((err) => {
      console.error('Failed to fetch search results:', err);
    });
  }, [searchQuery, customerClient]);

  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Searching for &quot;{searchQuery}&quot;...</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton className="h-[400px]" key={i} />
              ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Search Error</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      );
    }

    if (searchQuery) {
      return <ProductList categoryId={undefined} customProducts={searchResults} searchQuery={searchQuery} />;
    }

    return <ProductList categoryId={categoryId} customProducts={undefined} searchQuery={null} />;
  };

  return <>{renderContent()}</>;
}
