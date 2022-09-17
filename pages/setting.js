import { Footer } from '@components/Footer/index.js';
import Loading from '@components/Loading.js';
import Metatags from '@components/Metatags.js';
import Navbar from '@components/Navbar';
import SettingComponents from '@components/SettingComponents/index.js';
import AuthCheck from '@hooks/AuthCheck.js';
import { firestore, postToJSON } from '@lib/firebase.js';
import { Container } from '@mantine/core';
import React from 'react';
import { Animate } from 'react-simple-animate';

const LIMIT = 3;
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const postsQuery = firestore.collectionGroup('homePosts').limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  // Pass data to the page via props
  return { props: { posts } };
}

export default function SettingPage({ posts }) {
  return (
    <>
      <div className='bg-background text-accent min-h-[1024px] mb-[235px] pb-10'>
        {/* Navar */}
        <Navbar page='/setting' isBusy />
        <Metatags />
        {/* Check user and Setting*/}
        <Container size='lg'>
          <AuthCheck fallback={<Loading />}>
            <Animate
              play
              start={{ transform: 'translateY(1%)', opacity: '0' }}
              end={{ transform: 'translateY(0%)', opacity: '1' }}
            >
              <SettingComponents posts={posts} />
            </Animate>
          </AuthCheck>
        </Container>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}
