import { AspectRatio, Image, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { Clock, Star, ThumbUp } from 'tabler-icons-react';
import { kFormatter } from 'utils/Calculator';

export default function SmallScreen({ data, badges, date, likes, stars }) {
  const screenSmallSize = useMediaQuery('(max-width: 576px)');

  return (
    <div className='relative'>
      <AspectRatio ratio={16 / 9}>
        <div className='relative flex flex-col rounded-t-lg shadow-md cursor-pointer hover:brightness-90'>
          <div className='absolute z-[1]'>
            <Image
              src={data.image}
              alt={data.image}
              fit='cover'
              height={screenSmallSize ? 290 : 330}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              backgroundImage: `url(${data.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              filter: 'blur(3px)',
            }}
          />
          {/* <Image className='mb-16 w-full' src={data.image} alt={data.title} /> */}
        </div>
      </AspectRatio>
      <div className='absolute bottom-14 left-2 flex flex-row gap-1 z-[3] text-sm'>
        {badges}
      </div>
      <div className='relative bg-foreground rounded-b-lg px-2 py-3 text-title h-[65px] z-[2]'>
        <Tooltip
          label={data.title}
          position='top'
          withArrow
          className='absolute top-3 left-2 right-2 z-[4]'
        >
          <h1 className='truncate font-bold text-base'>{data.title}</h1>
        </Tooltip>
        <div className='absolute top-10 left-2 flex flex-row justify-start gap-4 text-sm z-[2]'>
          <div className='flex flex-row gap-1 items-center'>
            <Clock size={14} className='text-content' />
            <p className='opacity-80'>{date}</p>
          </div>
          <div className='flex flex-row gap-1 items-center'>
            <ThumbUp size={14} className='text-content' />
            <p className='opacity-80'>{kFormatter(likes)}</p>
          </div>
          <div className='flex flex-row gap-1 items-center'>
            <Star size={14} className='text-content' />
            <p className='opacity-80'>{kFormatter(stars)}</p>
          </div>
        </div>
        <div className='absolute bottom-1 right-2 z-[2]'>
          <h1 className='text-6xl text-title tracking-tighter font-bold opacity-5 uppercase'>
            {data.tag[0]?.label === 'คำถาม'
              ? 'QUESTION'
              : data.tag[0]?.label === 'รีวิว'
              ? 'REVIEW'
              : data.tag[0]?.label === 'สปอย'
              ? 'SPOILER'
              : data.tag[0]?.label === 'ข่าวสาร'
              ? 'NEWS'
              : 'OTHER'}
          </h1>
        </div>
      </div>
    </div>
  );
}
