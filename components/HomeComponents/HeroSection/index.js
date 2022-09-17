import Card from '@components/Card';
import { Box, Grid, Group, Space } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export default function HeroSection({ props }) {
  return (
    <Box>
      <div
        className={`bg-foreground  flex flex-row justify-between items-center transition-all py-1 px-3 font-bold md:text-base text-sm text-title drop-shadow`}
      >
        <Group style={{ gap: 2 }}>
          <Link href='/posts'>
            <a className='truncate max-w-[600px] cursor-pointer hover:underline'>
              โพสต์ใหม่วันนี้
            </a>
          </Link>
          <span className='ml-2 px-1 bg-content rounded-sm text-white text-xs'>
            New
          </span>
        </Group>
      </div>
      <Space h='xs' />
      <Grid gutter='xs' columns={3}>
        {props.map((data, index) => (
          <Grid.Col key={index} xs={3} sm={1}>
            <Card layout='grid' posts={data} />
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
