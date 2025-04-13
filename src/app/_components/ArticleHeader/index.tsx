import NextLink from 'next/link';
import type { FC } from 'react';

import styles from './styles.module.css';

import { NextImageWithFallback } from '~/app/_components/NextImageWithFallback';

export type ArticleHeaderProps = {
  breadcrumb: string[];
  title: string;
  image?: string;
  date?: string;
  author?: string;
  tags?: string[];
};

export const ArticleHeader: FC<ArticleHeaderProps> = ({
  breadcrumb,
  title,
  date,
  image,
  author,
  tags,
}) => {
  return (
    <>
      {image && (
        <div className="relative w-full max-w-[900px] aspect-7/2 mx-auto">
          <NextImageWithFallback
            src={image}
            alt=""
            width={800}
            height={300}
            className="w-full h-full object-cover grayscale-50 rounded-b-xl"
            fallback={'/images/wordmark-logo.svg'}
          />
          <div className="absolute block top-0 left-0 w-full h-full background opacity-40 bg-linear-60  from-[#06c] via-[#00b6d8] to-[#00d4af] rounded-b-xl" />
        </div>
      )}
      <header className={styles.header}>
        <ul className="inline-flex row-[1/2] col-[1/2] my-3 overflow-hidden text-sm text-gray-500 overflow-ellipsis whitespace-nowrap">
          {breadcrumb.map((x, i, self) => (
            <li key={x} className="text-gray-500">
              <NextLink href={self.slice(0, i + 1).join('/')}>{x}</NextLink>
            </li>
          ))}
        </ul>
        {date && (
          <p className="row-[1/2] col-[2/3] my-3 text-sm text-gray-500">
            {date}
          </p>
        )}
        <h1 className="row-[2/3] col-[1/3] my-4 text-4xl font-bold">{title}</h1>
        {author && (
          <span>
            by{' '}
            <a
              href={`https://github.com/${author}`}
              className="row-[3/4] col-[1/3] my-4 font-bold text-mcc-1 underline"
            >
              @{author}
            </a>
          </span>
        )}
        {tags && (
          <ul className="flex row-[4/5] col-[1/3] gap-2 my-4">
            {tags.map((x) => (
              <li
                key={x}
                className="px-2 py-1 text-sm font-bold rounded-lg shadow-neumorphism"
              >
                {x}
              </li>
            ))}
          </ul>
        )}
      </header>
    </>
  );
};
