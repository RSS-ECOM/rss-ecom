/* eslint-disable no-console */

'use client';

import ProductList from '@/components/layout/ProductList/ProductList';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomerClient } from '@/lib/customer-client';
import { type ProductProjection } from '@commercetools/platform-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { SortOption } from '../ProductList/ProductSort';

import { isSortOption } from '../ProductList/ProductSort';

interface ProductSearchWrapperProps {
  categoryId?: string;
  searchQuery?: null | string;
}

// eslint-disable-next-line max-lines-per-function
export default function ProductSearchWrapper({ categoryId, searchQuery }: ProductSearchWrapperProps): JSX.Element {
  const { customerClient } = useCustomerClient();
  const [searchResults, setSearchResults] = useState<ProductProjection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [filterParams, setFilterParams] = useState<Record<string, unknown>>({});
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const lastFilterUpdateTimestampRef = useRef<number>(0);
  const prevSearchQueryRef = useRef<null | string | undefined>();
  const prevFilterParamsRef = useRef<string>();
  const prevSortOptionRef = useRef<SortOption>();
  const prevSelectedCategoriesRef = useRef<string>();
  const searchRequestIdRef = useRef(0);
  const lastSuccessfulRequestIdRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('productSort');
      const validSort = savedSort && isSortOption(savedSort) ? savedSort : 'default';
      setSortOption(validSort);
    }
  }, []);

  useEffect(() => {
    if (!customerClient) {
      return;
    }
    if (!searchQuery) {
      setSearchResults([]);
      setError(null);
      if (isLoading) {
        setIsLoading(false);
      }
      return;
    }

    const currentFilterParamsString = JSON.stringify(filterParams);
    const currentSelectedCategoriesString = JSON.stringify(selectedCategories);

    const hasImportantChanges =
      searchQuery !== prevSearchQueryRef.current ||
      currentFilterParamsString !== prevFilterParamsRef.current ||
      sortOption !== prevSortOptionRef.current ||
      currentSelectedCategoriesString !== prevSelectedCategoriesRef.current;

    if (!hasImportantChanges && prevSearchQueryRef.current !== undefined) {
      console.log('PSW: No important search parameters changed, skipping request');
      return;
    }

    prevSearchQueryRef.current = searchQuery;
    prevFilterParamsRef.current = currentFilterParamsString;
    prevSortOptionRef.current = sortOption;
    prevSelectedCategoriesRef.current = currentSelectedCategoriesString;

    const currentRequestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = currentRequestId;

    const fetchSearchResults = async (): Promise<void> => {
      if (currentRequestId !== searchRequestIdRef.current) {
        console.log(
          `PSW: Request ${currentRequestId} is stale before fetch, current is ${searchRequestIdRef.current}. Skipping.`,
        );
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        if (searchQuery.length < 2) {
          console.log('PSW: Search query too short, skipping API call');
          setSearchResults([]);
          setIsLoading(false); // Ensure loading is stopped
          return;
        }

        if (currentRequestId !== searchRequestIdRef.current) {
          console.log(
            `PSW: Request ${currentRequestId} cancelled before API call: newer request ${searchRequestIdRef.current} in progress`,
          );
          setIsLoading(false);
          return;
        }

        const apiParams = {
          ...filterParams,
          categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
          sortBy: sortOption !== 'default' ? sortOption : undefined,
        };

        console.log(`PSW: Executing search request ${currentRequestId} with params:`, {
          filters: apiParams,
          query: searchQuery,
          sortPropDirectly: sortOption,
        });

        const response = await customerClient.searchProducts(searchQuery, {
          ...apiParams,
          sortOption: sortOption !== 'default' ? sortOption : undefined,
        });

        if (currentRequestId !== searchRequestIdRef.current) {
          console.log(
            `PSW: Results for request ${currentRequestId} discarded: newer request ${searchRequestIdRef.current} took over`,
          );
          return;
        }

        lastSuccessfulRequestIdRef.current = currentRequestId;

        console.log(`PSW: Search ${currentRequestId} completed successfully:`, {
          resultsCount: response?.results?.length || 0,
          totalMatches: response?.total || 0,
        });

        setSearchResults(response?.results || []);
      } catch (err) {
        console.error(`PSW: Error in search request ${currentRequestId}:`, err);
        if (currentRequestId === searchRequestIdRef.current) {
          setError(err instanceof Error ? err : new Error('Failed to search products'));
          setSearchResults([]);
        }
      } finally {
        if (currentRequestId === searchRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchSearchResults().catch((err) => {
      console.error('PSW: Unhandled error in fetchSearchResults promise chain:', err);
      if (currentRequestId === searchRequestIdRef.current) {
        setIsLoading(false);
        setError(err instanceof Error ? err : new Error('Failed to initiate search results fetch'));
      }
    });
  }, [searchQuery, customerClient, filterParams, sortOption, selectedCategories, isLoading]); // Added state setters from props/context

  const handleSortChange = (newSortOption: SortOption): void => {
    console.log('PSW: Sorting changed to:', newSortOption);
    setSortOption(newSortOption);
    if (typeof window !== 'undefined') {
      localStorage.setItem('productSort', newSortOption);
    }
  };

  const handleFilterChange = useCallback(
    (newFiltersFromProductList: Record<string, unknown>): void => {
      console.log('PSW: handleFilterChange received:', newFiltersFromProductList);

      const isEmptyUpdate = Object.keys(newFiltersFromProductList).length === 0;
      const hasRecentUpdate = Date.now() - lastFilterUpdateTimestampRef.current < 500;

      if (isEmptyUpdate && hasRecentUpdate) {
        console.log('PSW: Ignoring empty filter update that arrived too soon after previous update');
        return;
      }

      if (!isEmptyUpdate) {
        lastFilterUpdateTimestampRef.current = Date.now();
      }

      if (Object.prototype.hasOwnProperty.call(newFiltersFromProductList, 'category')) {
        const categoryValue = newFiltersFromProductList.category;
        if (Array.isArray(categoryValue)) {
          // Fix type assertion by using proper type checking
          const newCats = categoryValue.filter((item) => typeof item === 'string');
          setSelectedCategories((prevCats) =>
            JSON.stringify(prevCats) !== JSON.stringify(newCats) ? newCats : prevCats,
          );
        }
      }

      setFilterParams((currentInternalFilters) => {
        const nextInternalFilters: Record<string, unknown> = {};
        if (
          newFiltersFromProductList.price &&
          Array.isArray(newFiltersFromProductList.price) &&
          newFiltersFromProductList.price.length === 2
        ) {
          const priceArray = newFiltersFromProductList.price;
          if (
            Array.isArray(priceArray) &&
            priceArray.length === 2 &&
            typeof priceArray[0] === 'number' &&
            typeof priceArray[1] === 'number'
          ) {
            nextInternalFilters.priceFrom = priceArray[0] * 100;
            nextInternalFilters.priceTo = priceArray[1] * 100;
          }
        } else if (
          Object.prototype.hasOwnProperty.call(newFiltersFromProductList, 'price') &&
          !newFiltersFromProductList.price
        ) {
          delete nextInternalFilters.priceFrom;
          delete nextInternalFilters.priceTo;
        }

        if (JSON.stringify(currentInternalFilters) === JSON.stringify(nextInternalFilters)) {
          return currentInternalFilters;
        }
        console.log('PSW: nextInternalFilters (price, etc.) to be set by handleFilterChange:', nextInternalFilters);
        return nextInternalFilters;
      });
    },
    [setSelectedCategories, setFilterParams],
  );

  const handleCategoryChange = useCallback(
    (categories: string[]): void => {
      console.log('PSW: handleCategoryChange (dedicated) received:', categories);
      setSelectedCategories((prevCats) =>
        JSON.stringify(prevCats) !== JSON.stringify(categories) ? categories : prevCats,
      );
    },
    [setSelectedCategories],
  );

  if (isLoading && searchRequestIdRef.current > lastSuccessfulRequestIdRef.current) {
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
    return (
      <ProductList
        categoryId={undefined}
        customProducts={searchResults}
        onCategoryChange={handleCategoryChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        sortOption={sortOption}
      />
    );
  }

  return <ProductList categoryId={categoryId} customProducts={undefined} searchQuery={null} />;
}
