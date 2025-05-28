'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useProduct } from '@/hooks/use-product';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProductPage({ params }: { params: { id: string } }): JSX.Element {
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { id } = params;

  const { data: product, error, isLoading } = useProduct(id);

  const price = product?.masterVariant?.prices?.[0].value?.centAmount
    ? (product.masterVariant.prices[0].value.centAmount / 100).toFixed(2)
    : null;
  const discounted = product?.masterVariant?.prices?.[0].discounted?.value?.centAmount
    ? (product.masterVariant.prices[0].discounted.value.centAmount / 100).toFixed(2)
    : null;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }
  if (!product) {
    return <div>Product not found</div>;
  }

  console.log(product);

  return (
    <Dialog>
      <div className="container mx-auto pt-6 flex pb-10">
        <div className="basis-2/5 px-20 shrink-0">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent className="-ml-2">
              {product.masterVariant?.images?.map((image) => (
                <CarouselItem className="pl-2 flex justify-center align-start" key={image.url}>
                  <div className="flex justify-center align-start h-[400px]">
                    <DialogTrigger asChild>
                      <Image
                        alt={product.name['en-US']}
                        className="object-cover cursor-zoom-in"
                        height={400}
                        src={image.url}
                        style={{
                          objectPosition: 'center',
                        }}
                        width={250}
                      />
                    </DialogTrigger>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {count > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>

        <div className="grow-0 flex flex-col justify-start gap-4">
          <h2 className="text-2xl font-bold">{product.name['en-US']}</h2>
          <div>
            {product.masterVariant?.attributes?.map((attribute) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              attribute.value['en-US'] ? (
                <p className="flex items-center gap-2" key={attribute.name}>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  <span>{attribute.name}</span> <span>{attribute.value['en-US']}</span>
                </p>
              ) : null,
            )}
          </div>
          <div>{product.description?.['en-US']}</div>
          {price &&
            (discounted ? (
              <div className="flex items-end gap-2">
                <span className="text-lg bold text-red-500">{discounted} $</span>
                <span className="text-sm line-through">{price} $</span>
              </div>
            ) : (
              <div>
                <span className="text-lg bold">{price} $</span>
              </div>
            ))}
          <Button className="w-80">Add to Cart</Button>
        </div>

        <DialogContent className="h-[800px] w-[80vw] max-w-[80vw] px-20">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {product.masterVariant?.images?.map((image) => (
                <CarouselItem className="pl-2 flex justify-center align-start" key={image.url}>
                  <div className="flex justify-center align-start h-[755px]">
                    <Image
                      alt={product.name['en-US']}
                      className="object-cover"
                      height={1200}
                      src={image.url}
                      style={{
                        objectFit: 'contain',
                      }}
                      width={400}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {count > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </DialogContent>
      </div>
    </Dialog>
  );
}
