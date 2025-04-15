'use client';

import classnames from 'classnames';
import NextLink from 'next/link';
import type { FC } from 'react';

import styles from './styles.module.css';

import WordmarkLogo from '/public/icons/wordmark-logo.svg';

type NavbarProps = {
  noBrand?: boolean;
  transparent?: boolean;
  color?: 'mcc' | 'white';
  theme?: 'transparent' | 'opaque' | 'auto';
};

export const Navbar: FC<NavbarProps> = ({
  transparent = false,
  color = 'mcc',
  noBrand = false,
}) => {
  return (
    <>
      <nav className={styles.nav}>
        <div
          className={classnames(
            styles.navbar,
            transparent && styles._transparent,
          )}
        >
          {!noBrand && (
            <NextLink href="/" className={styles.brand}>
              <WordmarkLogo
                color={color === 'white' ? 'white' : undefined}
                width={36}
              />
            </NextLink>
          )}
        </div>
      </nav>
    </>
  );
};
