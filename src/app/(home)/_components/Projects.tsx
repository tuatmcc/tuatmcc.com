'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { FC } from 'react';
import { orbitron } from '~/app/fonts';

// プロジェクトデータ
const projectsData = [
  {
    id: 1,
    title: 'RicoShot',
    image: '/images/ricoshot-poster.webp', // 実際の画像パスに置き換えてください
    description:
      '2024年度農学部祭に向けて制作した、マルチプレイシューティングゲーム. Unity × Web.',
  },
  {
    id: 2,
    title: 'Project 2',
    image: '/images/spring-camp-2022-hackathon.webp',
    description: 'Description for Project 2',
  },
  {
    id: 3,
    title: 'Project 3',
    image: '/images/project3.jpg',
    description: 'Description for Project 3',
  },
  {
    id: 4,
    title: 'Project 4',
    image: '/images/project4.jpg',
    description: 'Description for Project 4',
  },
];

export const Projects: FC = () => {
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);

  return (
    <motion.section
      className="w-full relative h-screen overflow-hidden"
      initial="hidden"
      whileInView="bgVisible"
      viewport={{
        once: false,
        amount: 0.6,
      }}
    >
      {/* 背景に選択されたプロジェクトのぼんやりした画像 */}
      <motion.div
        className="fixed inset-0 w-full h-full z-[-1]"
        variants={{
          hidden: {
            opacity: 0,
          },
          bgVisible: {
            opacity: 1,
          },
        }}
        transition={{ duration: 1 }}
      >
        {projectsData.map((project) => {
          const isSelected = selectedProject.id === project.id;
          return (
            <motion.div
              key={project.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isSelected ? 1 : 0,
                scale: isSelected ? 1 : 0.9,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                ease: 'easeInOut',
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="100vw"
                quality={90}
                className="object-cover scale-110"
                loading="lazy"
              />
            </motion.div>
          );
        })}

        <div className="absolute inset-0 bg-white/80" />
      </motion.div>

      {/* コンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h2
          className={classNames(
            'md:text-4xl font-bold text-mcc-1 mb-8 tracking-wide',
            orbitron.className,
          )}
        >
          Projects
        </h2>
        <span className="h-2 bg-mcc-1 w-16 block mb-8" />

        {/* プロジェクト一覧 */}
        <div className="flex gap-16 w-full overflow-x-hidden px-12">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className={`overflow-hidden shrink-0 cursor-pointer transition-all duration-500 delay-200 ease-in-out
                ${
                  selectedProject.id === project.id
                    ? 'w-4/12'
                    : Math.abs(selectedProject.id - project.id) === 1
                      ? 'w-3/12 opacity-100'
                      : 'w-2/12 opacity-80 hover:opacity-100'
                }`}
              onMouseEnter={() => setSelectedProject(project)}
              onFocus={() => setSelectedProject(project)}
            >
              <div className="relative w-full grid grid-cols-[1fr] grid-rows-[1fr] overflow-hidden h-64">
                <div className="h-full col-[1/2] row-[1/2]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover p-1"
                  />
                </div>
                <div className="border-mcc-1 border-[1px] col-[1/2] row-[1/2]" />

                <motion.div
                  className="absolute bottom-1 left-1 right-1 bg-white/90 p-2 pr-24"
                  initial={{
                    translateY: 60,
                    opacity: 0,
                  }}
                  animate={{
                    opacity: selectedProject.id === project.id ? 1 : 0,
                    translateY: selectedProject.id === project.id ? 0 : 60,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: selectedProject.id === project.id ? 0.5 : 0,
                  }}
                >
                  <h4 className="text-xs font- text-gray-800 overflow-hidden text-ellipsis">
                    {project.description}
                  </h4>
                </motion.div>
              </div>
              <div
                className={classNames(
                  orbitron.className,
                  'grid grid-cols-[auto_1fr] items-center gap-2',
                )}
              >
                <h4 className="font-bold text-lg text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {project.title}
                </h4>
                <div className="h-[2px] bg-mcc-2 block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
