import { AspectRatio, Badge, Image, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { firestore } from 'lib/firebase';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Clock, Star, ThumbUp } from 'tabler-icons-react';
import { kFormatter } from 'utils/Calculator';
import LargeScreen from './LargeScreen';
import SmallScreen from './SmallScreen';

export default function Card({ posts, layout }) {
  const [data] = useState(posts);
  const [stars, setStars] = useState();
  const [likes, setLikes] = useState();

  const screenSmallSize = useMediaQuery('(max-width: 576px)');

  useEffect(() => {
    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    const getStars = async () => {
      const userStatistics = firestore
        .collection('users')
        .doc(posts.uid)
        .collection('posts')
        .doc(posts.slug)
        .collection('stars');

      const userStatisticsPosts = await (
        await userStatistics.get()
      ).docs.map((data) => data.data());

      const starsArray = userStatisticsPosts.map((stars) => stars.stars);

      if (starsArray.length === 0) setStars(0);
      else setStars(average(starsArray));
    };

    const getLikes = async () => {
      const userStatistics = firestore
        .collection('users')
        .doc(posts.uid)
        .collection('posts')
        .doc(posts.slug)
        .collection('likes');

      const userStatisticsPosts = await (
        await userStatistics.get()
      ).docs.map((data) => data.data());

      if (userStatisticsPosts.length === 0) setLikes(0);
      else setLikes(userStatisticsPosts.length);
    };

    getStars();
    getLikes();
  }, [posts]);

  const createdAt =
    typeof data?.createdAt === 'number'
      ? new Date(data.createdAt)
      : data?.createdAt.toDate();

  const date = createdAt?.toLocaleDateString('th-th', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const badges = data.tag.map((badge, index) => (
    <Badge
      key={index}
      gradient={{ from: badge.color?.from, to: badge.color?.to, deg: 30 }}
      radius='sm'
      variant='gradient'
      className='shadow-md'
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Link href={`posts/${data.username}/${data.slug}`}>
      <a>
        {layout === 'grid' ? (
          <div className='relative'>
            <AspectRatio ratio={16 / 9}>
              <div className='relative flex flex-col rounded-t-lg shadow-md cursor-pointer hover:brightness-90'>
                <div className='absolute z-[1]'>
                  <Image
                    src={data.image}
                    alt={data.image}
                    fit='cover'
                    height={screenSmallSize ? 290 : 200}
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
        ) : (
          <div>
            <div className='sm:flex sm:visible hidden w-full'>
              <LargeScreen
                data={data}
                badges={badges}
                date={date}
                likes={likes}
                stars={stars}
              />
            </div>
            <div className='sm:hidden visible w-full'>
              <SmallScreen
                data={data}
                badges={badges}
                date={date}
                likes={likes}
                stars={stars}
              />
            </div>
          </div>
        )}
      </a>
    </Link>
  );
}
