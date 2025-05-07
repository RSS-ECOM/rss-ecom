import { useEffect, useState } from 'react';

interface ApiDataType {
  // Define parameters your hook needs
  id: string;
  name: string;
}

interface UseExampleDataProps {
  // Define parameters your hook needs
  id?: string;
}

interface UseExampleDataResult {
  data: ApiDataType | null;
  error: Error | null;
  isLoading: boolean;
}

async function fetchTypedJson<T>(response: Response): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
}

export default function useExampleData(props: UseExampleDataProps): UseExampleDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ApiDataType | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (!props.id) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`https://api.example.com/data?id=${props.id}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await fetchTypedJson<ApiDataType>(response);
        
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(() => {
    });
    
    return function cleanup(): void {
    };
  }, [props.id]);

  return {
    data,
    error,
    isLoading,
  };
}
