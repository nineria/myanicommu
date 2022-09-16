import { Group, Image } from '@mantine/core';
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
    <Group spacing='xs' grow>
      {DUMMY_AD.map((item) => (
        <Image
          key={uid(item)}
          onClick={() => router.push(item.href)}
          src={item.image.src}
          alt={item.image.alt}
          style={{
            cursor: 'pointer',
          }}
        />
      ))}
    </Group>
  );
}
