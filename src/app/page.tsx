import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookMarked, BookOpen, BookText } from '@/components/ui/icons';
import Link from 'next/link';

// eslint-disable-next-line max-lines-per-function
export default function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full h-screen flex items-center justify-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to Story Hive
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Buzzing with Great Reads for Every Reader!
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/products">Browse Books</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">Join Our Community</Link>
              </Button>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 animate-bounce">
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Scroll Down</p>
                <svg
                  className="text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Categories</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our carefully curated collection of books for all ages and interests.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            {[
              {
                description: 'Immerse yourself in captivating stories and imaginary worlds',
                icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />,
                title: 'Fiction',
              },
              {
                description: 'Expand your knowledge with informative and insightful reads',
                icon: <BookText className="h-8 w-8 mb-2 text-primary" />,
                title: 'Non-Fiction',
              },
              {
                description: 'Magical stories and educational books for young readers',
                icon: <BookMarked className="h-8 w-8 mb-2 text-primary" />,
                title: "Children's Books",
              },
            ].map((category) => (
              <Card
                className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
                key={category.title}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-center">{category.icon}</div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="gap-1" variant="ghost">
                    <Link href={`/categories/${category.title.toLowerCase().replace(/\\'s/, 's')}`}>
                      Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">New Arrivals</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                The latest additions to our growing library of titles.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4 lg:gap-8 mt-8">
            {['The Silent Echo', 'Gardens of Memory', 'Quantum Shadows', 'The Last Chapter'].map((book) => (
              <Card className="overflow-hidden" key={book}>
                <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Book Cover</p>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{book}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full" size="sm" variant="outline">
                    <Link href={`/products/${book.toLowerCase().replace(/\s+/g, '-')}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/products">View All Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="w-full py-12 md:py-24 bg-muted/40 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Quick Navigation</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">Find your way around our virtual bookstore.</p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/sign-up">
                    Register
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/account">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/account/orders">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Bookstore</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/products">
                    All Books
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/categories">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/authors">
                    Authors
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/cart">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/events">
                    Book Events
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-primary underline-offset-4 hover:underline" href="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
