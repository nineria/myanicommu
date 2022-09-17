import { Footer } from '@components/Footer';
import HomeComponents from '@components/HomeComponents';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import { firestore, postToJSON } from '@lib/firebase';
import React from 'react';

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps() {
  // Home posts
  const postsQuery = firestore
    .collectionGroup('homePosts')
    .orderBy('createdAt', 'asc')
    .limit(LIMIT);

  const homePosts = (await postsQuery.get()).docs.map(postToJSON);

  // Review posts
  const postsReviewQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc');

  const rawPosts = (await postsReviewQuery.get()).docs.map(postToJSON);

  const reviewPosts = rawPosts
    .filter((post) => {
      return post.tag[0].label === 'รีวิว' ? true : false;
    })
    .map((filtered) => filtered);

  // Today posts

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
  return (
    <>
      <div className='bg-background min-h-[1024px] mb-[235px] pb-10'>
        <Navbar />
        <Metatags />
        <HomeComponents
          homePosts={props.homePosts}
          reviewPosts={props.reviewPosts}
          todayPosts={props.todayPosts}
        />
      </div>
      <Footer />
    </>
  );
}
