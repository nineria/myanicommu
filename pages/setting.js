import Motion from '@components/Animate/Motion';
import { Footer } from '@components/Footer.js';
import Loading from '@components/Loading.js';
import Metatags from '@components/Metatags.js';
import Navbar from '@components/Navbar';
import SettingComponents from '@components/SettingComponents/index.js';
import AuthCheck from '@hooks/AuthCheck.js';
import { firestore, postToJSON } from '@lib/firebase.js';
import { Container } from '@mantine/core';
import React from 'react';

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
        <Container size='md'>
          <AuthCheck fallback={<Loading />}>
            <Motion>
              <SettingComponents posts={posts} />
            </Motion>
          </AuthCheck>
        </Container>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}
