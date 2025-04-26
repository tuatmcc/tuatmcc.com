import classNames from 'classnames';
import Image from 'next/image';
import type { FC } from 'react';
import { orbitron } from '~/app/fonts';
import { SlideIn } from './SlideIn';

export const Introduction: FC = () => (
  <div className="relative w-full flex flex-col">
    <div className="relative flex w-full max-w-[1200px] mx-auto p-4">
      <SlideIn />
      <div
        className="absolute z-[-1] bg-mcc-1 top-24 pl-[500px] left-24 right-0 h-80"
        style={{
          clipPath: `polygon(
            0 0,
            0 calc(100% - 20px),
            20px 100%,
            100% 100%,
            100% 80px,
            calc(100% - 80px) 0
          )`,
        }}
      >
        <div className="">
          <Image
            src="/images/ricoshot-poster.webp"
            alt="RicoShot"
            width={500}
            height={400}
            className="p-8 object-cover"
          />
          <h2
            className={classNames(
              orbitron.className,
              'text-4xl font-bold tracking-wide pl-4 mb-8 text-gray-900',
            )}
          >
            Game Dev
          </h2>
        </div>
      </div>
    </div>
  </div>
);
