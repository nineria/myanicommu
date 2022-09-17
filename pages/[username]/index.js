import { Footer } from '@components/Footer';
import Loading from '@components/Loading';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import ProfileComponents from '@components/ProfileComponents';
import { firestore, getUserWithUsername, postToJSON } from '@lib/firebase';
import { Container } from '@mantine/core';
import AuthCheck from 'hooks/AuthCheck';
import { UserContext } from 'lib/context';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Animate } from 'react-simple-animate';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let statistics = null;
  let statisticsAdmin = null;
  let users = null;
  let posts = null;

  if (userDoc) {
    user = postToJSON(userDoc);
    const postsQuery = userDoc.ref.collection('posts');
    posts = (await postsQuery.get()).docs.map(postToJSON);

    const usersRef = firestore.collection('users');

    users = (await usersRef.get()).docs.map(postToJSON);

    const userStatistics = firestore.collection('statistics').doc(userDoc.id);
    statistics = (await userStatistics.get()).data();

    const usersStatistics = firestore.collection('statistics');
    statisticsAdmin = (await usersStatistics.get()).docs.map((doc) =>
      doc.data()
    );
  }

  return {
    props: { user, statistics, statisticsAdmin, users, posts },
  };
}

export default function UserProfilePage({
  user,
  users,
  statistics,
  statisticsAdmin,
  posts,
}) {
  const router = useRouter();

  const { username } = useContext(UserContext);

  const [userRef, setUserRef] = useState();

  useEffect(() => {
    if (!user || !posts) router.push('/');

    const getUserRef = async () => {
      const userDoc = await getUserWithUsername(username);
      setUserRef(userDoc);
    };

    getUserRef();
  }, [posts, router, user, username]);

  // Multiple Percentage Calculator
  // p = ( x / y ) * 100
  // Ex 100 (10 / 73) * 100

  // const socialProps = [
  //   {
  //     name: user?.email,
  //     icon: <Mail />,
  //   },
  //   {
  //     name: "Instagram",
  //     icon: <BrandInstagram />,
  //   },
  //   {
  //     name: "Github",
  //     icon: <BrandGithub />,
  //   },
  //   {
  //     name: "Linkedin",
  //     icon: <BrandLinkedin />,
  //   },
  // ];

  return (
    <div className='bg-background text-accent min-h-[1024px] mb-[235px] pb-10'>
      <Navbar page='/profile' isBusy />
      <Metatags />
      <Container size='md'>
        {username && user && posts && (
          <Animate
            play
            start={{
              transform: 'translateY(1%)',
              opacity: '0',
            }}
            end={{ transform: 'translateY(0%)', opacity: '1' }}
          >
            <AuthCheck fallback={<Loading />}>
              <ProfileComponents
                user={user}
                userRef={userRef}
                users={users}
                statistics={statistics}
                statisticsAdmin={statisticsAdmin}
                posts={posts}
              />
            </AuthCheck>
          </Animate>
        )}
      </Container>
      <Footer />
    </div>
  );
}
