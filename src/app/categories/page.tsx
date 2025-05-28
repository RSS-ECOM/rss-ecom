import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories = [
  {
    description: 'Fiction books',
    externalId: 'cat-fiction-001',
    id: 'e3e4f0a1-4ec4-46d4-9218-d31df53f3b0e',
    name: 'Fiction',
    slug: 'fiction',
  },
  {
    description: 'Non-fiction books',
    externalId: 'cat-nonfiction-001',
    id: '0d53f9b8-3d55-4d3c-aece-b781c4bbf81e',
    name: 'Non-Fiction',
    slug: 'non-fiction',
  },
  {
    description: 'Fantasy books',
    externalId: 'cat-fantasy-001',
    id: '155ada66-7950-4ff6-a547-bea629d8ad1f',
    name: 'Fantasy',
    slug: 'fantasy',
  },
  {
    description: 'Science Fiction books',
    externalId: 'cat-scifi-001',
    id: '7f72c280-cb7f-428c-acd5-4b7973cee7b5',
    name: 'Science Fiction',
    slug: 'sci-fi',
  },
  {
    description: 'Mystery books',
    externalId: 'cat-myst-001',
    id: '5212fc6d-a094-47da-af6b-a155e62a44ab',
    name: 'Mystery',
    slug: 'mystery',
  },
  {
    description: 'Romance books',
    externalId: 'cat-romance-001',
    id: 'f40a78a6-97f9-4998-aa9c-fbcac85a29a8',
    name: 'Romance',
    slug: 'romance',
  },
  {
    description: 'Children books',
    externalId: 'cat-children-001',
    id: 'f66f3e8a-050a-4eca-9d0e-4c8d6eca8b3d',
    name: 'Children',
    slug: 'children',
  },
  {
    description: 'Biography books',
    externalId: 'cat-biography-001',
    id: 'c93e9929-c9fb-4520-9a4a-5a0d8f59c2c3',
    name: 'Biography',
    slug: 'biography',
  },
];

export default function CategoriesPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Categories</h1>
        <p className="text-muted-foreground">Explore our book collection by category to find your next great read.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div className="bg-muted/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" key={category.id}>
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <Button asChild>
              <Link href={`/categories/${category.slug}`}>Browse {category.name}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
