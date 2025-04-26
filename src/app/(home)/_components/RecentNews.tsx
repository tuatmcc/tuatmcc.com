'use client';

import type { FC } from 'react';

import classNames from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';
import { orbitron } from '~/app/fonts';
import { news } from '.velite';

export const RecentNews: FC = () => {
  const recentNews = news
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <section className="w-full h-screen">
      <div className="w-full flex max-w-[1200px] mx-auto mt-12 relative justify-end">
        <motion.div
          className="flex flex-row-reverse w-[1000px] mx-auto max-w-full p-8 pb-20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <div className="bg-mcc-2">
            {/*           <motion.div */}
            {/*             className="absolute w-full bg-blue-600 left-0 top-[-120px] bottom-[400px] z-[-1]" */}
            {/*             style={{ */}
            {/*               clipPath: `polygon( */}
            {/*             0 0, 0 calc(100% - 30px), 200px calc(100% - 30px), 230px 100%, calc(100% - 90px) 100%, 100% calc(100% - 90px), 100% 40px, calc(100% - 40px) 0 */}
            {/* )`, */}
            {/*             }} */}
            {/*             variants={{ */}
            {/*               hidden: { */}
            {/*                 backgroundColor: 'var(--color-gray-100)', */}
            {/*               }, */}
            {/*               visible: { */}
            {/*                 bottom: '0px', */}
            {/*                 backgroundColor: 'var(--color-blue-600)', */}
            {/*                 transition: { */}
            {/*                   duration: 1.2, */}
            {/*                 }, */}
            {/*               }, */}
            {/*             }} */}
            {/*           /> */}
            <motion.h2
              className={classNames(
                orbitron.className,
                'text-4xl font-bold tracking-wide pl-4 mb-8 text-gray-900',
              )}
              variants={{
                visible: {
                  color: 'var(--color-gray-100)',
                },
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-yellow-500">N</span>
              ews
              <span className="h-2 bg-gray-800 w-16 block mt-8 mb-8" />
            </motion.h2>
            <ul className="list-none pl-6 flex flex-col gap-2 mb-6">
              {recentNews.map((news) => (
                <li key={news.slug} className="mb-2 text-gray-100">
                  <a href={news.permalink} className="flex items-center gap-4">
                    <span
                      className={classNames(
                        'text-xs font-bold tracking-wider min-w-[80px]',
                      )}
                    >
                      {news.date}
                    </span>
                    <h3 className="">{news.title}</h3>
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/news"
              className={classNames(
                orbitron.className,
                'flex items-center gap-2 text-gray-100 mr-8 px-4 font-bold tracking-wider self-end hover:bg-gray-100 hover:text-blue-600 transition-all duration-300',
              )}
            >
              <FaPlus />
              ALL NEWS
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
