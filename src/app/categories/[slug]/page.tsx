'use client';

import ProductList from '@/components/layout/ProductList/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Category {
  description: string;
  id: string;
  name: string;
}

interface CategoriesMap {
  [key: string]: Category;
}

const categories: CategoriesMap = {
  biography: {
    description: 'True stories about real people',
    id: 'c93e9929-c9fb-4520-9a4a-5a0d8f59c2c3',
    name: 'Biography',
  },
  children: {
    description: 'Books for young readers',
    id: 'f66f3e8a-050a-4eca-9d0e-4c8d6eca8b3d',
    name: 'Children',
  },
  fantasy: {
    description: 'Fantasy books and magical worlds',
    id: '155ada66-7950-4ff6-a547-bea629d8ad1f',
    name: 'Fantasy',
  },
  fiction: {
    description: 'Fiction books',
    id: 'e3e4f0a1-4ec4-46d4-9218-d31df53f3b0e',
    name: 'Fiction',
  },
  mystery: {
    description: 'Thrilling mysteries and detective stories',
    id: '5212fc6d-a094-47da-af6b-a155e62a44ab',
    name: 'Mystery',
  },
  'non-fiction': {
    description: 'Informative and educational books',
    id: '0d53f9b8-3d55-4d3c-aece-b781c4bbf81e',
    name: 'Non-Fiction',
  },
  romance: {
    description: 'Love stories and romantic novels',
    id: 'f40a78a6-97f9-4998-aa9c-fbcac85a29a8',
    name: 'Romance',
  },
  'sci-fi': {
    description: 'Science Fiction books',
    id: '7f72c280-cb7f-428c-acd5-4b7973cee7b5',
    name: 'Science Fiction',
  },
};

export default function CategoryPage(): JSX.Element {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  if (!slug || !Object.prototype.hasOwnProperty.call(categories, slug)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find the category you&apos;re looking for.</p>
        <Button asChild>
          <Link href="/categories">View All Categories</Link>
        </Button>
      </div>
    );
  }

  const category = categories[slug];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2">
        <Link className="text-primary hover:underline mb-4 inline-block" href="/categories">
          ← Back to all categories
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name} Books</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <ProductList categoryId={category.id} />
    </div>
  );
}
