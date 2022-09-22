import ADSide from '@components/ADSide';
import Motion from '@components/Animate/Motion';
import { Footer } from '@components/Footer';
import Add from '@components/HomeComponents/Add';
import Advertisement from '@components/HomeComponents/Advertisement';
import Post from '@components/HomeComponents/Body';
import HeroSection from '@components/HomeComponents/HeroSection';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import AdminCheck from '@hooks/AdminCheck';
import { UserContext } from '@lib/context';
import { firestore, postToJSON } from '@lib/firebase';
import { Button, Center, Container, Modal, Stack } from '@mantine/core';
import React, { useContext, useState } from 'react';

export const admin = 'ผู้ดูแลระบบ';

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('homePosts')
    .orderBy('createdAt', 'asc')
    .limit(10);

  const homePosts = (await postsQuery.get()).docs.map(postToJSON);

  const postsReviewQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const rawPosts = (await postsReviewQuery.get()).docs.map(postToJSON);

  const reviewPosts = rawPosts
    .filter((post) => {
      return post.tag[0].label === 'รีวิว' ? true : false;
    })
    .map((filtered) => filtered);

  const todayQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc')
    .limit(3);
  const todayPosts = (await todayQuery.get()).docs.map(postToJSON);

  return {
    props: { homePosts, reviewPosts, todayPosts }, // will be passed to the page component as props
  };
}

export default function HomePage(props) {
  const { user } = useContext(UserContext);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <div className='bg-background min-h-[1024px] mb-[235px] pb-10 '>
        <Navbar />
        <Metatags />
        <ADSide />
        <Container size='md'>
          <Motion>
            <Stack spacing='lg'>
              {props.todayPosts && <HeroSection props={props.todayPosts} />}
              {props.reviewPosts && <Post today post={props.reviewPosts} />}
              <Advertisement />
              <div className='block  space-y-2 mt-2 sm:mt-0'>
                {props.homePosts.map((post) => (
                  <Post key={post.slug} post={post} />
                ))}
              </div>
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
            </Stack>
          </Motion>
        </Container>
      </div>
      <Footer />
    </>
  );
}
