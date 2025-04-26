'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { FC } from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

export const Footer: FC = () => {
  return (
    <motion.div
      className="w-full flex flex-col justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.6,
      }}
    >
      <div className="flex flex-col py-24 items-center justify-center relative">
        <motion.p
          className="text-xl font-bold mb-4 w-[840px] max-w-full mx-auto leading-8 p-4"
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
              },
            },
          }}
        >
          技術を探求する部員が集結するMCC。
          <br />
          プログラミング、グラフィックデザイン、ハードウェアなど、
          <br />
          様々な興味を持つ部員たちが交流を重ね、 新しい視野を開拓する。 <br />
          それが東京農工大学マイクロコンピュータークラブです。
        </motion.p>
      </div>
      <footer className="flex flex-col gap-8 items-center justify-center">
        <Image
          src="/icons/wordmark-logo.svg"
          alt="MCC Logo"
          width={240}
          height={240}
        />
        <ul className="flex items-center justify-center py-12 px-4 md:px-12">
          <a
            href="https://x.com/tuatmcc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center mx-4"
          >
            <FaXTwitter className="w-6 h-6" />
            MCC
          </a>
          <a
            href="https://x.com/tuatkyopro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center mx-4"
          >
            <FaXTwitter className="w-6 h-6" /> 競プロ
          </a>
          <a
            href="https://github.com/tuatmcc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center mx-4"
          >
            <FaGithub className="w-6 h-6" /> GitHub
          </a>
        </ul>
        <p className="text-gray-500 w-full text-sm bg-gray-800 h-24 flex items-center justify-center md:hidden">
          ©2023 東京農工大学マイクロコンピュータークラブ
        </p>
        <p
          className="text-gray-500 w-full text-sm bg-gray-800 h-24 items-center justify-center hidden md:flex"
          style={{
            clipPath: `polygon(
              0 30px,
              0 100%,
              100% 100%,
              100% 30px,
              calc(100% - 30px) 60px,
              calc(50% + 240px) 60px,
              calc(50% + 180px) 0,
              calc(50% - 180px) 0,
              calc(50% - 240px) 60px,
              30px 60px
)`,
          }}
        >
          ©2023 東京農工大学マイクロコンピュータークラブ
        </p>
      </footer>
    </motion.div>
  );
};
