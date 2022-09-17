import Announcement from '@components/Announcement';
import PostLayout from '@components/Card/CardLayout';
import { Footer } from '@components/Footer';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import PostsMenuController from '@components/PostComponents/MenuController';
import { firestore, postToJSON } from '@lib/firebase';
import { Container, Stack } from '@mantine/core';
import React, { useState } from 'react';

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const rawPosts = (await postsQuery.get()).docs.map(postToJSON);

  const posts = rawPosts
    .filter((post) => {
      return post.tag[0].label === 'รีวิว' ? true : false;
    })
    .map((filtered) => filtered);

  const announcementsQuery = firestore
    .collectionGroup('announcements')
    .orderBy('createdAt', 'desc')
    .where('published', '==', true)
    .limit(3);

  const announcements = (await announcementsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts, announcements },
  };
}

export default function ReviewsPage(props) {
  const [layout, setLayout] = useState('grid');
  const [posts] = useState(props.posts);
  const [loading] = useState(false);

  const announcements = props.announcements.map((item, index) => (
    <Announcement key={index} {...item} />
  ));

  return (
    <>
      <div className='bg-background text-white min-h-[1024px] mb-[235px] pb-10'>
        <Metatags />
        <Navbar page='/reviews' />
        <Container size='lg'>
          <Stack spacing='xs'>
            {announcements}
            <PostsMenuController layout={layout} setLayout={setLayout} />
            <PostLayout posts={posts} layout={layout} loading={loading} />

            {posts.length < 1 && (
              <div className='flex justify-center'>ยังไม่มีโพสต์</div>
            )}
          </Stack>
        </Container>
      </div>
      <Footer />
    </>
  );
}
