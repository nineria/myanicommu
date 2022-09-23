import ADSide from '@components/ADSide';
import Announcement from '@components/Announcement';
import Card from '@components/Card';
import PostLayout from '@components/Card/CardLayout';
import { Footer } from '@components/Footer';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import PostsMenuController from '@components/PostComponents/MenuController';
import { firestore, postToJSON } from '@lib/firebase';
import {
  Button,
  Container,
  Divider,
  Grid,
  Space,
  Stack,
  TextInput,
} from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { uid } from 'react-uid';
import { Search } from 'tabler-icons-react';

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const posts = (await postsQuery.get()).docs.map(postToJSON);

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

export default function PostsPage(props) {
  const [layout, setLayout] = useState('grid');
  const [loading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('post-layout') == null) {
      localStorage.setItem('post-layout', JSON.stringify(layout));
    } else {
      var getLayout = localStorage.getItem('post-layout');
      setLayout(JSON.parse(getLayout));
    }
  }, [layout]);

  const handleToggle = useCallback(
    (value) => {
      localStorage.setItem('post-layout', JSON.stringify(value));
      setLayout(value);
    },
    [layout]
  );

  const announcements = props.announcements.map((item, index) => (
    <Announcement key={index} {...item} />
  ));

  const filtered =
    filteredPosts &&
    filteredPosts.map((item) => <Card key={uid + item.title} posts={item} />);

  const handleSearch = () => {
    if (!searchValue) {
      setFilteredPosts([]);
      setNotFound(true);
      return;
    }

    setNotFound(false);
    const result = props.posts.filter((post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (result.length < 1) {
      setFilteredPosts([]);
      setNotFound(true);
      return;
    }

    setFilteredPosts(result);
    setSearchValue('');
  };

  // const [currentPage, setCurrentPage] = useState(router.query?.page || 1);
  // const [postsPerPage] = useState(12);

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  // const totalPosts = Math.ceil(posts.length / postsPerPage);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  //   router.replace(`posts/?page=${pageNumber}`);
  // };

  return (
    <>
      <div className='bg-background text-white min-h-[1024px] mb-[235px] pb-10 '>
        <Metatags />
        <Navbar page='/posts' />
        <ADSide />
        <Container size='md'>
          <Stack spacing='xs'>
            {announcements}
            <Stack spacing='xs'>
              <Grid color={12} grow>
                <Grid.Col span={10}>
                  <TextInput
                    placeholder='ค้นหา'
                    value={searchValue}
                    icon={<Search size={14} />}
                    classNames={{
                      input:
                        'bg-accent border-title border-opacity-20 border-[1px]',
                    }}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Button
                    fullWidth
                    onClick={() => handleSearch()}
                    className='bg-content text-[#fff] hover:bg-content hover:opacity-75 '
                    variant='default'
                  >
                    ค้นหา
                  </Button>
                </Grid.Col>
              </Grid>
              {filteredPosts.length >= 1 && (
                <>
                  <Divider label='ผลการค้นหา' labelPosition='center' />
                  {filtered}
                  <Space h='xs' />
                </>
              )}
              {notFound && (
                <Divider
                  label='ไม่พบโพสต์ที่ต้องการ 😭'
                  labelPosition='center'
                />
              )}
            </Stack>

            <PostsMenuController layout={layout} handleToggle={handleToggle} />

            {props.posts && (
              <PostLayout
                posts={props.posts}
                layout={layout}
                loading={loading}
              />
            )}

            {props.posts.length < 1 && (
              <div className='flex justify-center'>ยังไม่มีโพสต์</div>
            )}

            {/* {totalPosts > 1 && (
              <Pagination
                page={currentPage}
                onChange={(pageNumber) => {
                  setCurrentPage(pageNumber);
                  router.push(`posts/?page=${pageNumber}`);
                }}
                total={totalPosts}
                classNames={{
                  active: 'bg-content',
                  item: 'bg-foreground',
                }}
                size='sm'
              />
            )} */}
          </Stack>
        </Container>
      </div>
      <Footer />
    </>
  );
}
