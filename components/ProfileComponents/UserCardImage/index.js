import React, { useContext, useEffect, useState } from 'react';
// Components
import {
  Avatar,
  Button,
  Card,
  Modal,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
// Components
import Report from 'components/Report';
import { UserContext } from 'lib/context';
import { getUserWithUsername } from 'lib/firebase';
import { BiLinkExternal } from 'react-icons/bi';
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import { Edit } from 'tabler-icons-react';
import CustomWebsite from '../CustomWebsite';
import EditProfile from '../EditProfile';
import Social from '../Social';
import Statistics from './Statistics';
import UserRanks from './UserRanks';

const DUMMY_SOCIAL = [
  {
    label: 'FACEBOOK',
    icon: <BsFacebook size={24} />,
    text: 'changlovemom@gmail.com',
    link: 'https://www.facebook.com/NineriaNananai',
  },
  {
    label: 'INSTAGRAM',
    icon: <BsInstagram size={24} />,
    text: 'ninerianananai',
    link: 'https://www.instagram.com/ninerianananai/',
  },
  {
    label: 'TWITTER',
    icon: <BsTwitter size={24} />,
    text: 'nineria_nananai',
    link: 'https://twitter.com/nineria_nananai',
  },
  {
    label: 'GITHUB',
    icon: <BsGithub size={24} />,
    text: 'nineria',
    link: 'https://github.com/nineria',
  },
];

const DUMMY_CUSTOM_WEBSITE = {
  text: 'nineria.vercel.app',
  link: 'https://nineria.vercel.app/',
  icon: <BiLinkExternal />,
};

export default function UserCardImage({ user, posts, statistics }) {
  const { username } = useContext(UserContext);

  const [editOpened, setEditOpened] = useState(false);

  const [userRanks, setUserRanks] = useState(null);

  useEffect(() => {
    const getRanks = async () => {
      const userDoc = await getUserWithUsername(user.username);

      let ranks = null;

      const ranksRef = await userDoc.ref.collection('ranks').get();
      ranks = await JSON.stringify(ranksRef.docs.map((doc) => doc.data()));

      ranks = JSON.parse(ranks);

      setUserRanks(ranks);
    };

    getRanks();
  }, [posts, user.username]);

  return (
    <Card p='md' radius='sm' className='bg-foreground'>
      <Card.Section
        sx={{
          backgroundImage: `url(${user.image})`,
          height: 360,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {username !== user.username && (
        <div className='fixed top-2 right-0 p-[2px] bg-foreground rounded-l-md'>
          <Report />
        </div>
      )}

      <div className='flex md:flex-row flex-col md:justify-around justify-center py-4'>
        <Stack spacing='xl' align='center'>
          <Avatar
            src={user.avatar}
            size={150}
            radius={150}
            mt={-100}
            className='border-2 border-[#fff]'
          />
          <div className='block'>
            <Title order={2} align='center' weight={500}>
              {user.username}
            </Title>
            <Text align='center' size='md' className='opacity-50'>
              {user.firstName} {user.lastName}
            </Text>
          </div>
        </Stack>
      </div>

      <Stack spacing='sm'>
        <UserRanks user={user} userRanks={userRanks} />

        {statistics && <Statistics statistics={statistics} />}

        <Space h='sm' />

        {DUMMY_SOCIAL && <Social data={DUMMY_SOCIAL} />}

        <Space h='sm' />

        {DUMMY_CUSTOM_WEBSITE && <CustomWebsite data={DUMMY_CUSTOM_WEBSITE} />}

        <Space h='sm' />

        {username === user.username && (
          <Button
            className='border-title md:my-0 my-10 text-title hover:opacity-75'
            variant='outline'
            radius='xl'
            rightIcon={<Edit size={20} />}
            onClick={() => setEditOpened(true)}
          >
            แก้ไขรายละเอียด
          </Button>
        )}

        <Modal
          size='xl'
          opened={editOpened}
          onClose={() => setEditOpened(false)}
          closeOnClickOutside={false}
          title='แก้ไขข้อมูลส่วนตัว'
          centered
          classNames={{
            modal: 'bg-foreground',
            overlay: 'bg-background',
            title: 'text-title',
          }}
        >
          {editOpened && <EditProfile user={user} setOpened={setEditOpened} />}
        </Modal>
      </Stack>
    </Card>
  );
}
