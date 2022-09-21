import Motion from '@components/Animate/Motion';
import Add from '@components/HomeComponents/Add';
import AdminCheck from '@hooks/AdminCheck';
import { Button, Center, Modal, Space } from '@mantine/core';
import { UserContext } from 'lib/context';
import React, { useContext, useState } from 'react';
import Advertisement from './Advertisement';
import Post from './Elements/Body';
import HeroSection from './HeroSection';

export const admin = 'ผู้ดูแลระบบ';

export default function HomeComponents({ homePosts, reviewPosts, todayPosts }) {
  const { user } = useContext(UserContext);

  const [opened, setOpened] = useState(false);

  return (
    <div className={` text-white w-full`}>
      <Motion>
        <div className='flex flex-col gap-2'>
          {todayPosts && <HeroSection props={todayPosts} />}

          <Space h='xs' />

          {reviewPosts && <Post today homePosts={reviewPosts} />}

          <Space h='xs' />

          <Advertisement />

          <Space h='xs' />

          {/* Display home post */}
          <div className='block  space-y-2 mt-2 sm:mt-0'>
            {homePosts &&
              homePosts.map((post, index) => (
                <Post key={index} homePosts={post} />
              ))}
          </div>

          {/* Add home post */}
          {user && (
            <AdminCheck>
              <Center my={10}>
                <Modal
                  size='lg'
                  opened={opened}
                  onClose={() => setOpened(false)}
                  closeOnClickOutside={false}
                  title='สร้างโพสต์ - หน้าหลัก'
                  centered
                  classNames={{
                    modal: 'bg-foreground',
                    overlay: 'bg-background',
                    title: 'text-title',
                  }}
                >
                  <Add setOpened={setOpened} />
                </Modal>
                <Button
                  onClick={() => setOpened(true)}
                  className='bg-content text-[#fff] hover:bg-content hover:opacity-75 '
                  variant='default'
                >
                  สร้างโพสต์ +
                </Button>
              </Center>
            </AdminCheck>
          )}
        </div>
      </Motion>
    </div>
  );
}
