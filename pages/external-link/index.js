import Logo from '@components/Logo';
import Metatags from '@components/Metatags';
import { Button, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { ExternalLink } from 'tabler-icons-react';

const ExternalLinkPage = () => {
  const router = useRouter();
  const { external } = router.query;

  return (
    <div className='relative bg-background text-white h-screen'>
      <Metatags />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Logo />
        <div className='bg-foreground rounded-md text-center mt-5 px-10 py-5'>
          <Stack>
            <Title order={4}>คุณกำลังออกจากเว็ปไซต์ MyAnimeCommunity</Title>
            <div className='flex flex-row justify-center items-center hover:text-content cursor-pointer'>
              <a
                href={external}
                target='_blank'
                rel='noreferrer'
                className='mr-2 underline'
                onClick={() => router.back()}
              >
                {external}
              </a>
              <ExternalLink size={14} />
            </div>
            <a
              href={external}
              target='_blank'
              rel='noreferrer'
              className='w-fit mx-auto'
              onClick={() => router.back()}
            >
              <Button className='bg-content hover:bg-content hover:opacity-75 '>
                ดำเนินการต่อ
              </Button>
            </a>
            <a
              className='cursor-pointer opacity-80 hover:opacity-100'
              onClick={() => router.back()}
            >
              {'< กลับไป'}
            </a>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default ExternalLinkPage;
