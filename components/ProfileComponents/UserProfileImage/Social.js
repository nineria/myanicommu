import { Group, Tooltip } from '@mantine/core';
import React from 'react';

export default function Social({ data }) {
  return (
    <Group position='center'>
      {data.map((item, index) => (
        <Tooltip key={index} label={item.text} withArrow>
          <a href={item.link} target='_blank' rel='noreferrer'>
            <Group style={{ gap: 3, cursor: 'pointer' }}>
              <div className=' w-fit p-1 rounded-full'>{item.icon}</div>
            </Group>
          </a>
        </Tooltip>
      ))}
    </Group>
  );
}
