'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ProductProjection } from '@commercetools/platform-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  formatPrice: (price: number, currencyCode?: string) => string;
  product: ProductProjection;
}

interface LocalizedString {
  [locale: string]: string;
}

function isLocalizedString(value: unknown): value is LocalizedString {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  return Object.values(value).some((val) => typeof val === 'string');
}

const getLocalizedText = (localizedObject: LocalizedString | null | string | undefined, defaultText = ''): string => {
  if (!localizedObject) {
    return defaultText;
  }

  if (typeof localizedObject === 'string') {
    return localizedObject;
  }

  if ('en-US' in localizedObject) {
    return localizedObject['en-US'];
  }

  const keys = Object.keys(localizedObject);
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    if (typeof localizedObject[key] === 'string') {
      return localizedObject[key];
    }
  }

  return defaultText;
};
export default function ProductCard({ formatPrice, product }: ProductCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

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

  if (pageCountAttr?.value) {
    if (typeof pageCountAttr.value === 'string') {
      pageCount = pageCountAttr.value;
    } else if (isLocalizedString(pageCountAttr.value)) {
      pageCount = getLocalizedText(pageCountAttr.value, '');
    } else {
      pageCount = String(pageCountAttr.value);
    }
  }

  return (
    <Link className="block h-full" href={`/products/${product.id}`}>
      <Card
        className={`overflow-hidden flex flex-col h-full transition-all duration-300 ${
          isHovered ? 'shadow-xl transform scale-[1.02]' : 'shadow-md hover:shadow-lg'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[3/4] relative bg-muted overflow-hidden">
          {product.masterVariant.images && product.masterVariant.images.length > 0 ? (
            <Image
              alt={getLocalizedText(product.name, '')}
              className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
              fill
              src={product.masterVariant.images[0].url}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}

          {/* Sale badge */}
          {hasDiscount && (
            <div
              className={`absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-md 
                          text-xs font-semibold transition-transform duration-300 ${
                            isHovered ? 'scale-110' : 'scale-100'
                          }`}
            >
              Sale
            </div>
          )}
        </div>

        <CardHeader className={`p-4 flex-grow transition-colors duration-300 ${isHovered ? 'bg-secondary/20' : ''}`}>
          <CardTitle className="text-lg h-12 line-clamp-2 mb-2">
            {getLocalizedText(product.name, 'Untitled Book')}
          </CardTitle>

          {/* Add author information */}
          {((): JSX.Element | null => {
            const authorAttr = product.masterVariant.attributes?.find((attr) => attr.name === 'author');
            if (!authorAttr?.value) {
              return null;
            }

            let authorText = '';
            if (typeof authorAttr.value === 'string') {
              authorText = authorAttr.value;
            } else if (isLocalizedString(authorAttr.value)) {
              authorText = getLocalizedText(authorAttr.value, '');
            } else {
              authorText = String(authorAttr.value);
            }

            return <div className="h-9 text-sm text-muted-foreground mb-2">by {authorText}</div>;
          })()}

          <CardDescription className="h-18 line-clamp-3 mb-4">
            {getLocalizedText(product.description, 'No description available')}
          </CardDescription>

          <div className="flex flex-col gap-1 h-16">
            {pageCount && <div className="text-sm text-muted-foreground">Pages: {pageCount}</div>}

            <div className="mt-1">
              {hasDiscount && discountedPrice > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-destructive font-bold text-lg text-shadow-sm">
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

        <CardFooter className={`p-4 pt-0 mt-auto transition-colors duration-300 ${isHovered ? 'bg-secondary/20' : ''}`}>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              asChild
              className={`font-medium transition-all duration-300 ${
                isHovered
                  ? 'bg-amber-800/20 hover:bg-amber-400/30 text-foreground border-amber-500'
                  : 'border-amber-500/70 hover:bg-amber-500/30 hover:border-amber-500'
              }`}
              variant="outline"
            >
              <Link href={`/products/${product.id}`}>Details</Link>
            </Button>
            <Button
              className={`font-medium transition-transform duration-300 ${
                isHovered ? 'bg-amber-600 hover:bg-amber-700 shadow-md' : 'bg-primary hover:bg-primary/90'
              }`}
              disabled={true}
            >
              Buy
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
