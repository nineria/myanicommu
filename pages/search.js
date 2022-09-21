import Motion from '@components/Animate/Motion';
import Card from '@components/Card';
import { Footer } from '@components/Footer';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
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
import React, { useState } from 'react';
import { uid } from 'react-uid';
import { Search } from 'tabler-icons-react';

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function SearchPage(props) {
  const [searchValue, setSearchValue] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [notFound, setNotFound] = useState(false);

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

  return (
    <>
      <div className='bg-background text-white min-h-[1024px] mb-[235px] pb-10'>
        <Metatags />
        <Navbar page='/search' />
        <Container size='md'>
          <Motion>
            <Space h='xl' />
            <Stack spacing='xs'>
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
            </Stack>
          </Motion>
        </Container>
      </div>
      <Footer />
    </>
  );
}
