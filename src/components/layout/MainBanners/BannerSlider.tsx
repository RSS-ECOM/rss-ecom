'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

interface Banner {
  colorScheme?: 'dark' | 'light';
  ctaLink: string;
  ctaText: string;
  description: string;
  id: string;
  imageUrl: string;
  title: string;
}

interface BannerSliderProps {
  autoplay?: boolean;
  banners: Banner[];
  className?: string;
  interval?: number;
}

function BannerSlider({ autoplay = true, banners, className, interval = 5000 }: BannerSliderProps): React.JSX.Element {
  const [api, setApi] = React.useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api || !autoplay) {
      return undefined;
    }

    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, interval);

    return (): void => {
      clearInterval(autoplayInterval);
    };
  }, [api, autoplay, interval]);

  React.useEffect(() => {
    if (!api) {
      return undefined;
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return undefined;
  }, [api]);

  const options: EmblaOptionsType = {
    dragFree: false,
    duration: 20,
    loop: true,
  };

  const handleApiChange = React.useCallback((newApi: EmblaCarouselType | undefined) => {
    if (newApi) {
      setApi(newApi);
    }
  }, []);

  return (
    <div className={cn('relative w-full rounded-md overflow-hidden', className)}>
      <Carousel className="w-full z-10" opts={options} setApi={handleApiChange}>
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <Image
                  alt={banner.title}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  src={banner.imageUrl}
                  style={{
                    objectPosition: 'center',
                  }}
                />
                <div
                  className={cn(
                    'absolute inset-0 flex flex-col justify-center p-8 md:p-16',
                    banner.colorScheme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/50 text-black',
                  )}
                >
                  <div className="max-w-xl space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{banner.title}</h2>
                    <p className="text-lg md:text-xl">{banner.description}</p>
                    <Button
                      asChild
                      className={
                        banner.colorScheme === 'dark'
                          ? 'border-white text-white bg-black hover:bg-white hover:text-black'
                          : 'text-black bg-white hover:bg-black hover:text-white'
                      }
                      size="lg"
                      variant={banner.colorScheme === 'dark' ? 'outline' : 'default'}
                    >
                      <Link href={banner.ctaLink}>{banner.ctaText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={cn('h-2 w-8 rounded-full transition-colors', current === index ? 'bg-primary' : 'bg-muted')}
              key={index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
      </Carousel>
    </div>
  );
}

export default BannerSlider;
