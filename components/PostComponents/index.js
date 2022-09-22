import React, { useEffect, useState } from 'react';

import { auth, firestore, getUserWithUsername } from 'lib/firebase';
import { useRouter } from 'next/router';
import Body from './Elements/Body';
import LeftMenu from './Elements/LeftMenu';
import TopMenu from './Elements/TopMenu';
import Layout from './Layout';

export default function PostComponents({ post, postRef }) {
  const [userRanks, setUserRanks] = useState(null);
  const [stars, setStars] = useState();
  const [likes, setLikes] = useState();
  const [likeState, setLikeState] = useState(false);
  const [active, setActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.split('#')[1] === postRef.id) return setActive(true);

    const getRanks = async () => {
      const userDoc = await getUserWithUsername(post.username);

      let ranks = null;

      const ranksRef = await userDoc.ref.collection('ranks').get();
      ranks = await JSON.stringify(ranksRef.docs.map((doc) => doc.data()));

      ranks = JSON.parse(ranks);

      setUserRanks(ranks);
    };

    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    const getStars = async () => {
      const userStatistics = firestore
        .collection('users')
        .doc(post.uid)
        .collection('posts')
        .doc(post.slug)
        .collection('stars');

      const userStatisticsPosts = await (
        await userStatistics.get()
      ).docs.map((data) => data.data());

      const starsArray = userStatisticsPosts.map((stars) => stars.stars);

      if (starsArray.length === 0) setStars(0);
      else setStars(average(starsArray));
    };

    const getLikes = async () => {
      const userStatistics = firestore
        .collection('users')
        .doc(post.uid)
        .collection('posts')
        .doc(post.slug)
        .collection('likes');

      const userStatisticsPosts = await (
        await userStatistics.get()
      ).docs.map((data) => data.data());

      const uid = auth.currentUser?.uid;

      userStatisticsPosts.map((like) => {
        if (like.uid === uid) {
          setLikeState(true);
          return;
        }
      });

      if (userStatisticsPosts.length === 0) setLikes(0);
      else setLikes(userStatisticsPosts.length);
    };

    getRanks();
    getStars();
    getLikes();
  }, [post]);

  return (
    <div
      className={`bg-foreground  my-2 sm:my-0 ${
        active ? 'border-2 border-[#ff3333] rounded-none' : 'rounded-sm'
      }`}
    >
      {active && (
        <div className='bg-[#ff3333] text-white text-center'>
          เนื้อหาที่ถูกรายงาน
        </div>
      )}

      <Layout>
        {post && (
          <LeftMenu
            post={post}
            userRanks={userRanks}
            stars={stars}
            likes={likes}
          />
        )}
        {post && (
          <TopMenu
            post={post}
            userRanks={userRanks}
            stars={stars}
            likes={likes}
          />
        )}
        {post && (
          <Body
            post={post}
            postRef={postRef}
            likes={likes}
            setLikes={setLikes}
            likeState={likeState}
            setLikeState={setLikeState}
          />
        )}
      </Layout>
    </div>
  );
}
