import Announcement from '@components/Announcement';
import PostLayout from '@components/Card/CardLayout';
import { Footer } from '@components/Footer';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import PostsMenuController from '@components/PostComponents/MenuController';
import { firestore, postToJSON } from '@lib/firebase';
import {
  Anchor,
  Breadcrumbs,
  Container,
  Pagination,
  Stack,
} from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const rawPosts = (await postsQuery.get()).docs.map(postToJSON);

  const posts = rawPosts
    .filter((post) => {
      return post.tag[0].label === 'คำถาม' ? true : false;
    })
    .map((filtered) => filtered);

  const announcementsQuery = firestore
    .collectionGroup('announcements')
    .orderBy('createdAt', 'desc')
    .where('published', '==', true)
    .limit(3);

  const announcements = (await announcementsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts, announcements }, // will be passed to the page component as props
  };
}

export default function QAndAsPage(props) {
  const [layout, setLayout] = useState('grid');
  const router = useRouter();

  const [posts] = useState(props.posts);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(router.query?.page || 1);
  const [postsPerPage] = useState(12);

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPosts = Math.ceil(posts.length / postsPerPage);

  const items = [
    { title: 'หน้าหลัก', href: '/' },
    { title: 'โพสต์ทั้งหมด', href: '/posts' },
    { title: 'คำถาม', href: '#' },
  ].map((item, index) => (
    <Anchor size="sm" color="dimmed" href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const announcements = props.announcements.map((item, index) => (
    <Announcement key={index} {...item} />
  ));

  return (
    <>
      <div className="bg-background text-white min-h-[1024px] mb-[235px] pb-10">
        <Metatags />
        <Navbar page="/qandas" />
        <Container size="lg">
          <Stack spacing="xs">
            <Breadcrumbs separator="→">{items}</Breadcrumbs>
            {announcements}
            <PostsMenuController layout={layout} setLayout={setLayout} />
            {totalPosts > 1 && (
              <Pagination
                page={currentPage}
                // onChange={(pageNumber) => handlePageChange(pageNumber)}
                total={totalPosts}
                classNames={{
                  active: 'bg-content',
                  item: 'bg-foreground',
                }}
                size="sm"
              />
            )}
            <PostLayout
              // posts={currentPosts}
              posts={posts}
              layout={layout}
              loading={loading}
            />

            {posts.length < 1 && (
              <div className="flex justify-center">ยังไม่มีโพสต์</div>
            )}
            {totalPosts > 1 && (
              <Pagination
                page={currentPage}
                onChange={(pageNumber) => {
                  setCurrentPage(pageNumber);
                  router.push(`qandas/?page=${pageNumber}`);
                }}
                total={totalPosts}
                classNames={{
                  active: 'bg-content',
                  item: 'bg-foreground',
                }}
                size="sm"
              />
            )}
          </Stack>
        </Container>
      </div>
      <Footer />
    </>
  );
}
