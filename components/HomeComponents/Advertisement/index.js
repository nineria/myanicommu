import { Grid, Group, Image } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { uid } from 'react-uid';

const DUMMY_AD = [
  {
    title: '86-Eighty-Six',
    image: {
      src: 'https://i.ibb.co/V2HxPJg/86-Eighty-Six-Part-2.gif',
      alt: '86-Eighty-Six-Part-2',
    },
    href: '/posts/hunter/DL4G15DA6AN8BoXfKJki',
  },
  {
    title: 'Hibike-Euphonium',
    image: {
      src: 'https://i.ibb.co/V9TfHcd/Hibike-Euphonium-3-2024.gif',
      alt: 'Hibike-Euphonium-3-2024',
    },
    href: '/posts/hunter/86-eighty-six-season-2-episode-11-release-date-time-confirmed',
  },
];

export default function Advertisement() {
  const router = useRouter();
  return (
    <>
      <div
        className={
          'bg-foreground flex flex-row justify-between items-center transition-all py-1 px-3 font-bold md:text-base text-sm text-title drop-shadow'
        }
      >
        <Group style={{ gap: 2 }}>
          <p className='truncate max-w-[600px] cursor-pointer hover:underline'>
            โพสต์ที่น่าสนใจ
          </p>
          <span className='ml-2 px-1 bg-content rounded-sm text-white text-xs'>
            New
          </span>
        </Group>
      </div>
      <Grid columns={2} gutter='xs'>
        {DUMMY_AD.map((item) => (
          <Grid.Col key={uid(item)} xs={2} sm={1}>
            <Image
              onClick={() => router.push(item.href)}
              src={item.image.src}
              alt={item.image.alt}
              style={{
                cursor: 'pointer',
              }}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
