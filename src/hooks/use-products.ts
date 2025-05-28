import { useCustomerClient } from '@/lib/customer-client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useProducts() {
  const { customerClient } = useCustomerClient();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        if (!customerClient) return [];

        const response = await customerClient.getProducts({
          expand: ['productType', 'prices'],
        });

        console.log('Products response:', response);

        return response?.results || [];
      } catch (err) {
        console.error('Error fetching products:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    products,
    isLoading,
    error,
  };
}

export function useProductsByCategory(categoryId?: string) {
  const { customerClient } = useCustomerClient();

  useEffect(() => {
    if (customerClient) {
      customerClient.update();
    }
  }, [customerClient]);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      try {
        if (!customerClient || !categoryId) return [];

        customerClient.update();

        console.log(`Fetching products for category: ${categoryId}`);
        const productsData = await customerClient.getProductsByCategory(categoryId);
        console.log(`Got products:`, productsData?.results?.length || 0);
        return productsData?.results || [];
      } catch (err) {
        console.error(`Error fetching products for category ${categoryId}:`, err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!customerClient && !!categoryId,
  });

  return {
    products,
    isLoading,
    error,
  };
}
