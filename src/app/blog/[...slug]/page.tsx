import { notFound } from 'next/navigation';

import styles from './styles.module.css';

import type { Metadata } from 'next';

import { Article } from '~/app/_components/Article';
import { ArticleBottom } from '~/app/_components/ArticleBottom';
import { ArticleHeader } from '~/app/_components/ArticleHeader';
import { BackToTop } from '~/app/_components/BackToTop';
import { Footer } from '~/app/_components/Footer';
import { Navbar } from '~/app/_components/Navbar';
import { Navigation } from '~/app/_components/Navigation/Navigation';
import {
  defaultOgImage,
  defaultOpenGraph,
  defaultTwitterCard,
  metadataBase,
} from '~/lib/sharedmetadata';
import { blog } from '.velite';

type Params = { slug: string[] }; // [...slug]

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.find((post) => {
    return post.slug.split('/').slice(1).join('/') === slug.join('/');
  });

  if (!post) return notFound();

  const { title, img } = post;
  return {
    metadataBase,
    title,
    openGraph: {
      ...defaultOpenGraph,
      title: {
        default: title,
        template: '%s - MCC',
      },
      images: [
        {
          ...defaultOgImage,
          url: img?.src ? `https://tuatmcc.com${img.src}` : defaultOgImage.url,
        },
      ],
    },
    twitter: {
      ...defaultTwitterCard,
      images: [
        {
          url: img?.src ? `https://tuatmcc.com${img.src}` : defaultOgImage.url,
        },
      ],
    },
  };
}

export default async function Blog({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = blog.find((post) => {
    return post.slug.split('/').slice(1).join('/') === slug.join('/');
  });

  if (!post) return notFound();

  const { title, date, img, author, tags, permalink } = post;
  const parentPath = permalink.split('/').slice(0, -1).join('/');
  return (
    <>
      <Navbar theme="opaque" />
      <Navigation>
        <ArticleHeader
          breadcrumb={permalink.split('/')}
          title={title}
          image={img?.src}
          date={date}
          author={author}
          tags={tags}
        />
        <main className={styles.main}>
          <Article>
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: しかたがない
              dangerouslySetInnerHTML={{ __html: post.content }}
              suppressHydrationWarning
            />
          </Article>
          <ArticleBottom
            parent={{
              href: parentPath,
              children: '← 記事一覧に戻る',
            }}
          />
        </main>
        <Footer />

        <BackToTop />
      </Navigation>
    </>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  // すべての記事のパスを生成
  return blog.map((post) => {
    return {
      slug: post.slug.split('/').slice(1),
    };
  });
}
