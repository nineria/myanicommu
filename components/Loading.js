import { Button, Center, Loader, Space, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export default function Loading({ children }) {
  return (
    <Stack my='xs' align='center'>
      <Space h='xl' />
      <Center>
        <Loader variant='dots' color='red' />
      </Center>
      <Center>
        <Text size='xs' className='text-title'>
          {children || 'กำลังโหลด...'}
        </Text>
      </Center>
      <Space h='xl' />

      <Link href='/'>
        <Button
          className='bg-content  text-[#fff] hover:bg-content hover:opacity-75'
          variant='default'
        >
          กลับหน้าหลัก
        </Button>
      </Link>
    </Stack>
  );
}
