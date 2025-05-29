/* eslint-disable no-console */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useProductsByCategory } from '@/hooks/use-products';
import { useCustomerClient } from '@/lib/customer-client';
import { type ProductProjection } from '@commercetools/platform-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { FilterGroup, FilterState } from './ProductFilters';

import ProductFilters from './ProductFilters';
import ProductSort, { type SortOption, isSortOption } from './ProductSort';

interface ProductListProps {
  categoryId?: string;
}

interface LocalizedString {
  [key: string]: string;
  'en-US': string;
}

function isLocalizedString(value: unknown): value is LocalizedString {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'en-US' in value && typeof Object.getOwnPropertyDescriptor(value, 'en-US')?.value === 'string';
}

// eslint-disable-next-line max-lines-per-function
export default function ProductList({ categoryId }: ProductListProps): JSX.Element {
  const { customerClient } = useCustomerClient();
  const [filterParams, setFilterParams] = useState<Record<string, unknown>>({});
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [persistentFilters, setPersistentFilters] = useState<FilterState>({});
  const [allLoadedProducts, setAllLoadedProducts] = useState<ProductProjection[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProjection[]>([]);
  const [isUsingLocalFilter, setIsUsingLocalFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('productSort');
      return savedSort && isSortOption(savedSort) ? savedSort : 'default';
    }
    return 'default';
  });

  useEffect(
    () =>
      setFilterGroups([
        {
          id: 'price',
          name: 'Price',
          priceRange: { max: 30, min: 7 },
          type: 'price',
        },
        {
          id: 'category',
          name: 'Category',
          options: [
            { count: 0, id: 'e3e4f0a1-4ec4-46d4-9218-d31df53f3b0e', name: 'Fiction' },
            { count: 0, id: '0d53f9b8-3d55-4d3c-aece-b781c4bbf81e', name: 'Non-Fiction' },
            { count: 0, id: '155ada66-7950-4ff6-a547-bea629d8ad1f', name: 'Fantasy' },
            { count: 0, id: '5212fc6d-a094-47da-af6b-a155e62a44ab', name: 'Mystery' },
            { count: 0, id: '7f72c280-cb7f-428c-acd5-4b7973cee7b5', name: 'Science Fiction' },
            { count: 0, id: 'f40a78a6-97f9-4998-aa9c-fbcac85a29a8', name: 'Romance' },
            { count: 0, id: 'f66f3e8a-050a-4eca-9d0e-4c8d6eca8b3d', name: 'Young Adult' },
            { count: 0, id: 'c93e9929-c9fb-4520-9a4a-5a0d8f59c2c3', name: 'Biography' },
          ],
          type: 'checkbox',
        },
        {
          id: 'author',
          name: 'Author',
          options: [],
          type: 'checkbox',
        },
      ]),
    [],
  );

  useEffect(() => {
    if (customerClient) {
      customerClient.update();
    }
  }, [customerClient]);

  const allProducts = useProducts(filterParams);
  const categoryProducts = useProductsByCategory(categoryId, filterParams);
  const { error, isLoading, products } = categoryId ? categoryProducts : allProducts;

  const handleFilterChange = useCallback(
    (newFilters: FilterState): void => {
      console.log('handleFilterChange called with:', newFilters);

      setFilters(newFilters);
      setPersistentFilters(newFilters);

      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }

      filterTimeoutRef.current = setTimeout(() => {
        const authorFilter = newFilters.author;
        const hasAuthorFilter = authorFilter !== undefined && Array.isArray(authorFilter) && authorFilter.length > 0;

        if (hasAuthorFilter && allLoadedProducts.length > 0) {
          const apiParams: Record<string, unknown> = {
            sortBy: filterParams.sortBy,
          };

          Object.entries(newFilters).forEach(([key, value]) => {
            if (key !== 'author') {
              if (key === 'price' && Array.isArray(value)) {
                if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
                  apiParams.priceFrom = value[0] * 100;
                  apiParams.priceTo = value[1] * 100;
                }
              } else if (key === 'category' && Array.isArray(value) && value.length > 0) {
                apiParams.categoryIds = value;
                apiParams.categoryOperator = 'or';
              }
            }
          });

          const authorGroup = filterGroups.find((group) => group.id === 'author');
          let authorNames: string[] = [];

          if (authorGroup?.options) {
            const authorIds = Array.isArray(newFilters.author) ? newFilters.author : [];
            authorNames = authorIds
              .map((authorId) => {
                const option = authorGroup.options?.find((opt) => opt.id === authorId);
                return option ? option.name : '';
              })
              .filter(Boolean);

            console.log('Looking for authors:', authorNames);
          }

          const locallyFilteredProducts = allLoadedProducts.filter((product) => {
            const authorAttr = product.masterVariant.attributes?.find((attr) => attr.name === 'author');
            if (!authorAttr || !authorAttr.value) {
              return false;
            }

            if (!isLocalizedString(authorAttr.value)) {
              return false;
            }

            const authorValue = authorAttr.value['en-US'];

            return authorNames.some((name) => authorValue.includes(name));
          });

          setFilteredProducts(locallyFilteredProducts);
          setIsUsingLocalFilter(true);

          setFilterParams(apiParams);
        } else {
          const apiParams: Record<string, unknown> = {
            sortBy: filterParams.sortBy,
          };

          Object.entries(newFilters).forEach(([key, value]) => {
            if (key === 'price' && Array.isArray(value)) {
              if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
                apiParams.priceFrom = value[0] * 100;
                apiParams.priceTo = value[1] * 100;
              }
            } else if (key === 'category' && Array.isArray(value) && value.length > 0) {
              apiParams.categoryIds = value;
              apiParams.categoryOperator = 'or';
            }
          });

          setIsUsingLocalFilter(false);
          setFilterParams(apiParams);
        }
      }, 500);
    },
    [allLoadedProducts, filterParams.sortBy, filterGroups],
  );

  useEffect(() => {
    if (products && products.length > 0) {
      setAllLoadedProducts(products);
    }
  }, [products]);

  // products and filterGroups
  useEffect(() => {
    if (products && products.length > 0) {
      const authors = new Map<string, number>();
      const categoryOccurrences = new Map<string, number>();

      products.forEach((product) => {
        const authorAttr = product.masterVariant.attributes?.find((attr) => attr.name === 'author');
        if (authorAttr && authorAttr.value) {
          if (isLocalizedString(authorAttr.value)) {
            const authorValue = authorAttr.value['en-US'];
            authors.set(authorValue, (authors.get(authorValue) || 0) + 1);
          }
        }

        if (product.categories && Array.isArray(product.categories)) {
          product.categories.forEach((category) => {
            if (category.typeId === 'category') {
              const categoryId = category.id;
              categoryOccurrences.set(categoryId, (categoryOccurrences.get(categoryId) || 0) + 1);
            }
          });
        }
      });

      setFilterGroups((prevGroups) => {
        const updatedGroups = prevGroups.map((group) => {
          if (group.id === 'price') {
            return group;
          }

          if (group.id === 'author') {
            return {
              ...group,
              options: Array.from(authors.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, count]) => count > 0)
                .map(([author, count]) => ({
                  count,
                  id: author.toLowerCase().replace(/\s+/g, '-'),
                  name: author,
                })),
            };
          }

          if (group.id === 'category') {
            return {
              ...group,
              options: group.options?.map((option) => ({
                ...option,
                count: categoryOccurrences.get(option.id) || 0,
              })),
            };
          }

          return group;
        });

        return updatedGroups;
      });
    }
  }, [products]);

  // compare and restore filters
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Checking filters vs persistentFilters:', { filters, persistentFilters });

      if (Object.keys(persistentFilters).length > 0) {
        const filtersEqual = compareFilterObjects(filters, persistentFilters);

        if (!filtersEqual) {
          console.log('restore filters: they are not equal to current filters');
          setFilters(persistentFilters);

          const apiParams: Record<string, unknown> = {};
          Object.entries(persistentFilters).forEach(([key, value]) => {
            if (key === 'price' && Array.isArray(value) && value.length === 2) {
              if (typeof value[0] === 'number' && typeof value[1] === 'number') {
                apiParams.priceFrom = value[0] * 100;
                apiParams.priceTo = value[1] * 100;
              }
            } else if (key === 'category' && Array.isArray(value) && value.length > 0) {
              const allStrings = value.every((item) => typeof item === 'string');
              if (allStrings) {
                apiParams.categoryIds = value;
                apiParams.categoryOperator = 'or';
              }
            } else if (key === 'author' && Array.isArray(value) && value.length > 0) {
              const allStrings = value.every((item) => typeof item === 'string');
              if (allStrings) {
                apiParams.authors = value;
              }
            }
          });

          console.log('restore filterParams:', apiParams);
          apiParams.sortBy = filterParams.sortBy;
          setFilterParams(apiParams);
        }
      } else if (Object.keys(filters).length > 0) {
        console.log('Reset filters because persistentFilters is empty');
        setFilters({});
        setFilterParams((prevParams) => ({
          sortBy: prevParams.sortBy,
        }));
      }
    }
  }, [products, filters, persistentFilters, filterParams.sortBy]);

  function compareFilterObjects(obj1: FilterState, obj2: FilterState): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
          return false;
        }

        return val1.every((element, index) => element === val2[index]);
      }

      return val1 === val2;
    });
  }

  // sorting
  const handleSortChange = useCallback((newSortOption: SortOption): void => {
    console.log('Sorting changed to:', newSortOption);
    setSortOption(newSortOption);

    if (typeof window !== 'undefined') {
      localStorage.setItem('productSort', newSortOption);
    }

    setFilterParams((prevParams) => ({
      ...prevParams,
      sortBy: newSortOption,
    }));
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-4 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{categoryId ? 'Category Products' : 'All Products'}</h2>
          <ProductSort onSortChange={handleSortChange} selectedSort={sortOption} />
        </div>
        <ProductFilters className="sticky top-24" filterGroups={filterGroups} onFilterChange={handleFilterChange} />

        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
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
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-4 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{categoryId ? 'Category Products' : 'All Products'}</h2>
          <ProductSort onSortChange={handleSortChange} selectedSort={sortOption} />
        </div>
        <div className="hidden md:block">
          <ProductFilters filterGroups={filterGroups} onFilterChange={handleFilterChange} />
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error
              ? `Error loading products: ${error.message}`
              : "We couldn't find any products with the selected filters."}
          </p>
          <Button asChild>
            <Link href="/categories">Browse all categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayProducts = isUsingLocalFilter ? filteredProducts : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1 md:col-span-4 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{categoryId ? 'Category Products' : 'All Products'}</h2>
        <ProductSort onSortChange={handleSortChange} selectedSort={sortOption} />
      </div>
      <ProductFilters className="sticky top-24" filterGroups={filterGroups} onFilterChange={handleFilterChange} />

      <div className="col-span-1 md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product: ProductProjection) => {
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
      </div>
    </div>
  );
}
