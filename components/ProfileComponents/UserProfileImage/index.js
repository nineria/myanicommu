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
import UserReport from '@components/UserReport';
import { UserContext } from 'lib/context';
import { getUserWithUsername } from 'lib/firebase';
import { useRouter } from 'next/router';
import { BiLinkExternal } from 'react-icons/bi';
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import { Edit } from 'tabler-icons-react';
import EditProfile from '../EditProfile';
import CustomWebsite from './CustomWebsite';
import Social from './Social';
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
  const router = useRouter();

  const [editOpened, setEditOpened] = useState(false);
  const [userRanks, setUserRanks] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (router.asPath.split('#')[1] === user.username) return setActive(true);
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
    <Card
      p='md'
      className={`relative bg-foreground ${
        active ? 'border-2 border-[#ff3333] rounded-none' : 'rounded-sm'
      }`}
    >
      {active && (
        <div className='absolute -top-4 left-0 right-0'>
          <div className='bg-[#ff3333] text-white text-center mt-4'>
            เนื้อหาที่ถูกรายงาน
          </div>
        </div>
      )}
      <Card.Section
        sx={{
          backgroundImage: `url(${user.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
        className='md:h-[490px] h-[250px]'
      />
      {username !== user.username && (
        <div className='absolute flex top-8 right-0 p-[4px] pr-2 bg-foreground rounded-l-sm'>
          <UserReport
            size='xs'
            from={router.asPath + '#' + user.username}
            title={'โปรไฟล์ของ ' + user.username}
          />
        </div>
      )}

      {/* Avatar and Username */}
      <Stack spacing='sm' align='center'>
        <Avatar
          src={user.avatar}
          size={150}
          radius={150}
          mt={-80}
          className='border-4 border-[#fff]'
        />
        <div className='block'>
          <Title order={2} align='center' weight={500}>
            {user.username}
          </Title>
          <Text align='center' size='md' className='opacity-70'>
            ({user?.firstName} {user?.lastName})
          </Text>
        </div>

        {DUMMY_CUSTOM_WEBSITE && <CustomWebsite data={DUMMY_CUSTOM_WEBSITE} />}
      </Stack>

      <Space h='lg' />

      {/* User Information */}
      <Stack spacing='lg'>
        <UserRanks user={user} userRanks={userRanks} />

        {statistics && <Statistics statistics={statistics} />}

        {DUMMY_SOCIAL && <Social data={DUMMY_SOCIAL} />}

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
