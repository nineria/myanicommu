import ADSide from '@components/ADSide';
import Motion from '@components/Animate/Motion';
import { Footer } from '@components/Footer';
import Loading from '@components/Loading';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import AnnouncementControl from '@components/ProfileComponents/Admin/AnnouncementControl';
import ReportFormUser from '@components/ProfileComponents/Admin/ReportFormUser';
import StatsSegmentsAdmin from '@components/ProfileComponents/Admin/StatsSegmentsAdmin';
import UserManagement from '@components/ProfileComponents/Admin/UserManagement';
import { TableSort } from '@components/ProfileComponents/PostsTableSort';
import StatsSegments from '@components/ProfileComponents/StatsSegments';
import UserProfileImage from '@components/ProfileComponents/UserProfileImage';
import AdminCheck from '@hooks/AdminCheck';
import { UserContext } from '@lib/context';
import { firestore, getUserWithUsername, postToJSON } from '@lib/firebase';
import { Container, Stack, Title } from '@mantine/core';
import AuthCheck from 'hooks/AuthCheck';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let statistics = null;
  let statisticsAdmin = null;
  let users = null;
  let posts = null;
  let reports = null;

  if (userDoc) {
    user = postToJSON(userDoc);
    const postsRef = userDoc.ref.collection('posts');
    posts = (await postsRef.get()).docs.map(postToJSON);

    const usersRef = firestore.collection('users');
    users = (await usersRef.get()).docs.map(postToJSON);

    const statisticsRef = firestore.collection('statistics').doc(userDoc.id);
    statistics = (await statisticsRef.get()).data();

    const statisticsAdminRef = firestore.collection('statistics');
    statisticsAdmin = (await statisticsAdminRef.get()).docs.map((doc) =>
      doc.data()
    );

    const reportsRef = firestore.collection('reports');
    reports = (await reportsRef.get()).docs.map(postToJSON);
  }

  return {
    props: { user, statistics, statisticsAdmin, users, posts, reports },
  };
}

export default function UserProfilePage({
  user,
  users,
  statistics,
  statisticsAdmin,
  posts,
  reports,
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

  return (
    <div className='bg-background text-accent min-h-[1024px] mb-[235px] pb-10'>
      <Navbar page='/profile' isBusy />
      <Metatags />
      <ADSide />
      <Container size='md'>
        {user && posts && (
          <Motion>
            <AuthCheck fallback={<Loading />}>
              <UserProfileImage
                user={user}
                userRef={userRef}
                posts={posts}
                statistics={statistics}
              />
              {/* <StatsGridIcons statistics={statistics} /> */}
              {statistics && (
                <StatsSegments user={user} statistics={statistics} />
              )}

              {posts[0] && (
                <TableSort user={user} posts={posts} statistics={statistics} />
              )}

              {username === user.username && (
                <AdminCheck>
                  <Stack spacing='sm'>
                    <Title order={2} align='center' className='text-title mt-4'>
                      ส่วนของผู้ดูแลระบบ
                    </Title>
                    <StatsSegmentsAdmin statistics={statisticsAdmin} />
                    {users && <UserManagement users={users} />}
                    <div id='announcementControl'>
                      <AnnouncementControl />
                    </div>
                    {reports[0] && <ReportFormUser reports={reports} />}
                  </Stack>
                </AdminCheck>
              )}
            </AuthCheck>
          </Motion>
        )}
      </Container>
      <Footer />
    </div>
  );
}
