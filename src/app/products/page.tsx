import ProductList from '@/components/layout/ProductList/ProductList';

export default function ProductsPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Books Collection</h1>
        <p className="text-muted-foreground">Discover our carefully curated selection of books across all genres.</p>
      </div>

      <ProductList />
    </div>
  );
}
