import React from 'react';
// Components
import { Badge, Group, Title } from '@mantine/core';
// Icons
import { User } from 'tabler-icons-react';

export default function Top({ data }) {
  const tags = data.tag.map((badge, index) => (
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

  const genres = data.genre.map((item, index) => (
    <Badge
      mr={4}
      key={index}
      color='gray'
      size='xs'
      radius='sm'
      variant='filled'
    >
      {item}
    </Badge>
  ));

  return (
    <div className='text-title'>
      <Group spacing={4} my={4} className='items-center'>
        {tags}
        <Title className='ml-1 text-md sm:text-lg' order={4}>
          {data.title}
        </Title>
      </Group>
      <Group spacing={4} my={4} className='items-center text-sm'>
        <Group spacing={2} mr={4}>
          <User size={14} />
          {data.username}
        </Group>
        {genres}
      </Group>
    </div>
  );
}
