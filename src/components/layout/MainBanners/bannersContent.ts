import type { Banner } from '@/components/layout/MainBanners/BannerSlider';

const banners: Banner[] = [
  {
    colorScheme: 'light',
    ctaLink: '/collections/summer',
    ctaText: 'Shop Collection',
    customStyles: {
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      description: 'text-gray-200',
      overlay: 'bg-yellow-500/30 text-black',
      position: 'left',
      textAlign: 'left',
      title: 'text-black font-serif',
      titleUnderline: {
        color: '#F59E0B',
        height: '3px',
        show: false,
        width: '80px',
      },
    },
    description: 'Discover our handpicked summer books for beach days',
    id: '1',
    imageUrl: '/img/banners/hm-banner.png',
    title: 'Summer Reading Collection',
  },
  {
    colorScheme: 'dark',
    ctaLink: '/collections/mystery',
    ctaText: 'Start Reading',
    customStyles: {
      button: 'bg-primary hover:bg-primary/90 text-black',
      description: 'text-gray-200',
      overlay: 'bg-gradient-to-r from-black/70 to-transparent',
      position: 'left',
      title: 'text-white font-bold',
    },
    description: 'Dive into our exclusive mystery series from top authors',
    id: '2',
    imageUrl: '/img/banners/hm-banner.png',
    title: 'Midnight Mystery Series',
  },
  {
    colorScheme: 'light',
    ctaLink: '/collections/children',
    ctaText: 'Explore Books',
    customStyles: {
      button: 'bg-accent text-white hover:bg-accent/80',
      overlay: 'bg-gradient-to-t from-white/70 to-transparent',
      position: 'center',
      textAlign: 'center',
      title: 'text-black font-extrabold',
    },
    description: 'Colorful stories that inspire young imaginations',
    id: '3',
    imageUrl: '/img/banners/hm-banner.png',
    title: 'Books for Little Ones',
  },
];

export default banners;
