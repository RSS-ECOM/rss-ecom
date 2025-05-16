'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

export interface Banner {
  colorScheme?: 'dark' | 'light';
  ctaLink: string;
  ctaText: string;
  customStyles?: {
    button?: string;
    container?: string;
    description?: string;
    overlay?: string;
    position?: 'center' | 'left' | 'right';
    textAlign?: 'center' | 'left' | 'right';
    title?: string;
    titleUnderline?: {
      color?: string;
      height?: string;
      show: boolean;
      width?: string;
    };
  };
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
              <div
                className={cn('relative h-[50vh] md:h-[60vh] w-full overflow-hidden', banner.customStyles?.container)}
              >
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
                    'absolute inset-0 flex flex-col',
                    banner.colorScheme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/50 text-black',
                    {
                      'justify-center': !banner.customStyles?.position,
                      'justify-center items-center': banner.customStyles?.position === 'center',
                      'justify-center items-end': banner.customStyles?.position === 'right',
                      'justify-center items-start': banner.customStyles?.position === 'left',
                    },
                    'p-8 md:p-16',
                    banner.customStyles?.overlay,
                  )}
                >
                  <div
                    className={cn('max-w-xl space-y-4', {
                      'text-center': banner.customStyles?.textAlign === 'center',
                      'text-left': banner.customStyles?.textAlign === 'left' || !banner.customStyles?.textAlign,
                      'text-right': banner.customStyles?.textAlign === 'right',
                    })}
                  >
                    <h2
                      className={cn(
                        'text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative pb-4',
                        banner.customStyles?.title,
                      )}
                    >
                      {banner.title}
                      {banner.customStyles?.titleUnderline?.show && (
                        <span
                          className={cn('absolute block', {
                            'left-0': !banner.customStyles?.textAlign || banner.customStyles?.textAlign === 'left',
                            'left-1/2 -translate-x-1/2': banner.customStyles?.textAlign === 'center',
                            'left-full -translate-x-full': banner.customStyles?.textAlign === 'right',
                          })}
                          style={{
                            backgroundColor: banner.customStyles.titleUnderline.color || 'var(--primary)',
                            bottom: 0,
                            height: banner.customStyles.titleUnderline.height || '2px',
                            width: banner.customStyles.titleUnderline.width || '80px',
                          }}
                        />
                      )}
                    </h2>
                    <p className={cn('text-lg md:text-xl', banner.customStyles?.description)}>{banner.description}</p>
                    <Button
                      asChild
                      className={cn(
                        banner.colorScheme === 'dark'
                          ? 'border-white text-white bg-black hover:bg-white hover:text-black'
                          : 'text-black bg-white hover:bg-black hover:text-white',
                        banner.customStyles?.button,
                      )}
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
