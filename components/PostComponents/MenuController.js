import React, { useContext, useState } from 'react';
// Components
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Modal,
  SegmentedControl,
  Tooltip,
} from '@mantine/core';
import Add from 'components/PostComponents/Add';
// Icons
import AddAnnouncement from 'components/Announcement/Add';
import Verify from 'components/Verify';
import AdminCheck from 'hooks/AdminCheck';
import AuthCheck from 'hooks/AuthCheck';
import { UserContext } from 'lib/context';
import Link from 'next/link';
import { Edit, LayoutGrid, ListDetails } from 'tabler-icons-react';

export default function PostsMenuController({ layout, handleToggle }) {
  const { user, userData, username } = useContext(UserContext);

  const [opened, setOpened] = useState(false);

  return (
    <div className='flex flex-row justify-between w-full '>
      <Modal
        size='xl'
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
        opened={opened}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title='สร้างโพสต์'
      >
        <Add setOpened={setOpened} />
      </Modal>
      <Group className='bg-foreground p-1 rounded-lg' spacing='xs'>
        <AuthCheck fallback={<></>}>
          {userData && userData.email === '' ? (
            <Verify>สร้างโพสต์ +</Verify>
          ) : (
            <Button
              onClick={() => setOpened(true)}
              className='bg-content rounded-lg text-[#fff] hover:bg-content hover:opacity-75'
              variant='default'
            >
              สร้างโพสต์ +
            </Button>
          )}

          {/* Create New Announcement */}
          {user && (
            <AdminCheck>
              <Divider orientation='vertical' mx='none' />
              <AddAnnouncement />
              <Link href={`/${username}#announcementControl`}>
                <Button
                  leftIcon={<Edit size={14} />}
                  className='md:block hidden z-10 bg-background rounded-lg text-title hover:bg-background hover:opacity-75'
                  variant='default'
                >
                  จัดการประกาศ
                </Button>
              </Link>
              <Tooltip
                className='md:hidden block '
                label='จัดการประกาศ'
                placement='start'
                withArrow
              >
                <Link href={`/${username}#announcementControl`}>
                  <Button
                    className='z-10 bg-background rounded-lg p-2 text-title hover:bg-background hover:opacity-75'
                    variant='default'
                  >
                    <Edit size={20} />
                  </Button>
                </Link>
              </Tooltip>
            </AdminCheck>
          )}
        </AuthCheck>
      </Group>
      <Group position='center'>
        <SegmentedControl
          value={layout}
          onChange={(value) => handleToggle(value)}
          classNames={{
            root: 'bg-foreground rounded-lg',
            active: 'bg-content',
            labelActive: 'text-[#fff] hover:text-[#fff]',
          }}
          data={[
            {
              value: 'grid',
              label: (
                <Center>
                  <LayoutGrid size={16} />
                  <Box ml={5} className='md:block hidden'>
                    GRID
                  </Box>
                </Center>
              ),
            },
            {
              value: 'list',
              label: (
                <Center>
                  <ListDetails size={16} />
                  <Box ml={5} className='md:block hidden'>
                    LIST
                  </Box>
                </Center>
              ),
            },
          ]}
        />
      </Group>
    </div>
  );
}
