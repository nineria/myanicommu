import { Button, Group } from '@mantine/core';
import React from 'react';

export default function ButtonControl({ setOpened }) {
  return (
    <Group spacing='xs' position='right' mt='xl'>
      <Button
        onClick={() => setOpened(false)}
        className='bg-background rounded-lg text-title hover:bg-background hover:opacity-75'
      >
        ยกเลิก
      </Button>
      <Button
        type='submit'
        className='bg-green-500 rounded-lg hover:bg-green-500 hover:opacity-75'
      >
        ยืนยัน
      </Button>
    </Group>
  );
}
