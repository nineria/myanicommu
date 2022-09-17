import { Group, Tooltip } from '@mantine/core';
import React from 'react';

export default function CustomWebsite({ data }) {
  return (
    <Group position='center'>
      <Tooltip label={data.link} withArrow position='bottom'>
        <a href={data.link} target='_blank' rel='noreferrer'>
          <div className='flex flex-row items-center gap-1 bg-background px-4 rounded-full cursor-pointer'>
            {data.text} {data.icon}
          </div>
        </a>
      </Tooltip>
    </Group>
  );
}
