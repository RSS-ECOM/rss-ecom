import ProductSearchWrapper from '@/components/layout/Search/ProductSearchWrapper';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link'; // Make sure to import this

type ProductsPageProps = {
  searchParams: {
    categoryId?: string;
    q?: string;
  };
};

export default function ProductsPage({ searchParams }: ProductsPageProps): JSX.Element {
  const { categoryId, q: searchQuery } = searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {searchQuery ? (
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Search results for &quot;{searchQuery}&quot;</h1>
              <p className="text-muted-foreground">Showing books matching your search query.</p>
            </div>
            <Button asChild className="sm:self-start flex items-center gap-1 mt-1" variant="outline">
              <Link href="/products">
                <XCircle className="h-4 w-4" />
                <span>Clear search</span>
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Our Books Collection</h1>
            <p className="text-muted-foreground">
              Discover our carefully curated selection of books across all genres.
            </p>
          </>
        )}
      </div>

      <ProductSearchWrapper categoryId={categoryId} searchQuery={searchQuery} />
    </div>
  );
}
