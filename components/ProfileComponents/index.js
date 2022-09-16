import { Stack, Title } from '@mantine/core';
import AdminCheck from 'hooks/AdminCheck';
import { UserContext } from 'lib/context';
import React, { useContext } from 'react';
import AnnouncementControl from './AnnouncementControl';
import { TableSort } from './PostsTableSort';
import ReportFormUser from './ReportFormUser';
// import { StatsGridIcons } from './StatsGridIcons/StatsGridIcons';
// import { StatsGridIconsAdmin } from './StatsGridIcons/StatsGridIconsAdmin';
import StatsSegments from './StatsSegments/StatsSegments';
import StatsSegmentsAdmin from './StatsSegments/StatsSegmentsAdmin';
import UserCardImage from './UserCardImage';
import UserManagement from './UserManagement';

export default function ProfileComponents({
  user,
  userRef,
  users,
  statistics,
  statisticsAdmin,
  posts,
}) {
  const { username } = useContext(UserContext);

  return (
    <Stack spacing='xs'>
      <UserCardImage
        user={user}
        userRef={userRef}
        posts={posts}
        statistics={statistics}
      />
      {/* <StatsGridIcons statistics={statistics} /> */}
      <StatsSegments user={user} statistics={statistics} />
      {posts[0] && (
        <TableSort user={user} posts={posts} statistics={statistics} />
      )}

      {username === user.username && (
        <AdminCheck>
          <Title order={2} align='center' className='text-title mt-4'>
            ส่วนของผู้ดูแลระบบ
          </Title>

          {/* <StatsGridIconsAdmin statistics={statisticsAdmin} /> */}
          <StatsSegmentsAdmin statistics={statisticsAdmin} />
          {users && <UserManagement users={users} />}
          <div id='announcementControl'>
            <AnnouncementControl />
          </div>
          <ReportFormUser />
        </AdminCheck>
      )}
    </Stack>
  );
}
