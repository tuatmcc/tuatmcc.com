import type { Metadata } from 'next';

const url = 'https://tuatmcc.com';
const defaultTitle = 'MCC - 東京農工大学マイクロコンピュータークラブ';
const ogImageUrl = 'https://tuatmcc.com/images/og-image.png';
const description =
  'MCCは、東京農工大学の公認サークルで、ITに関することを学び、活動しているサークルです。学祭に制作物を出展したり、学内外のイベントに参加したり、学生同士で交流を深めたりしています。';

export const metadataBase = new URL('https://tuatmcc.com/');

export const defaultOgImage = {
  url: ogImageUrl,
  width: 1200,
  height: 630,
};

export const defaultOpenGraph: Metadata['openGraph'] = {
  title: {
    default: defaultTitle,
    template: '%s - MCC 東京農工大学マイクロコンピュータークラブ',
  },
  description,
  images: [defaultOgImage],
  locale: 'ja_JP',
  url,
  siteName: 'MCC 東京農工大学マイクロコンピュータークラブ',
  type: 'website',
};

export const defaultTwitterCard: Metadata['twitter'] = {
  creator: '@TUATMCC',
  title: {
    default: defaultTitle,
    template: '%s - MCC',
  },
  description,
  site: url,
  card: 'summary_large_image',
  images: [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  ],
};

export const sharedMetadata: Metadata = {
  metadataBase: metadataBase,
  title: {
    default: defaultTitle,
    template: '%s - MCC',
  },
  description,
  openGraph: defaultOpenGraph,
  icons: {
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-touch-icon',
        url: '/android-touch-icon.png',
      },
    ],
  },
  twitter: defaultTwitterCard,
};
