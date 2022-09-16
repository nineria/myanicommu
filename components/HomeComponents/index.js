import { useContext, useEffect, useState } from 'react';
// Context
import { UserContext } from 'lib/context';
// Components
import { Button, Center, Container, Modal } from '@mantine/core';
import Add from 'components/HomeComponents/Add';
import Post from './Elements/Body';
// Icons
import AdminCheck from 'hooks/AdminCheck';
import { firestore } from 'lib/firebase';
import React from 'react';
import { Animate } from 'react-simple-animate';
import Advertisement from './Advertisement';
import HeroSection from './HeroSection';

export const admin = 'ผู้ดูแลระบบ';

export default function HomeComponents({ homePosts, reviewPosts }) {
  const { user } = useContext(UserContext);

  const [opened, setOpened] = useState(false);

  const [newPostToday, setNewPostToDay] = useState();

  useEffect(() => {
    const getToDayPost = async () => {
      const query = firestore
        .collectionGroup('posts')
        .orderBy('createdAt', 'desc')
        .limit(4);
      const newPosts = (await query.get()).docs.map((doc) => doc.data());
      setNewPostToDay(newPosts);
    };
    getToDayPost();
  }, []);

  return (
    <Container size='lg'>
      <div className={`mt-2 text-white w-full`}>
        <Animate
          play
          start={{
            transform: 'translateY(1%)',
            opacity: '0',
          }}
          end={{ transform: 'translateY(0%)', opacity: '1' }}
        >
          <div className='flex flex-col gap-2'>
            {newPostToday && <HeroSection props={newPostToday} />}

            {reviewPosts && <Post today homePosts={reviewPosts} />}

            <Advertisement />

            {/* Display home post */}
            <div className='block space-y-2 mt-2 sm:mt-0'>
              {homePosts &&
                homePosts.map((post, index) => (
                  <Post key={index} homePosts={post} />
                ))}
            </div>

            {/* Add home post */}
            {user && (
              <AdminCheck>
                <Center>
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
        </Animate>
      </div>
    </Container>
  );
}
