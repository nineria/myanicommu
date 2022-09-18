import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import {
  Logout,
  Search,
  Settings,
  Users,
  ZoomQuestion,
} from 'tabler-icons-react';
// lib
import { UserContext } from '@lib/context';
import { auth } from '@lib/firebase';
// Constants
import { accessMenuProperty, navbarProperty } from '@constants/NavbarData';
import { Avatar, Container, Group, Indicator, Menu, Text } from '@mantine/core';
// Components
import Login from '../LoginRegister';
import LoginRegisterSmallScreen from './LoginRegisterSmallScreen';
import MyAniLogo from './MyAniLogo';
import NavbarMenu from './NavbarMenu';

export default function Navbar({ page, isBusy = false }) {
  const { username, userData } = useContext(UserContext);

  const [toggle, setToggle] = useState(false);

  const router = useRouter();

  const signOut = () => {
    auth.signOut();
    router.push('/');
  };

  return (
    <div className='bg-foreground py-2 sticky top-0 z-50 bg-opacity-95 mb-2 shadow-md'>
      <Container size='lg'>
        <div className='flex items-end justify-between w-full text-md'>
          <div className='text-4xl font-bold'>
            {/* Website Logo */}
            <MyAniLogo link='/' />
          </div>
          <div className='lg:flex hidden justify-start pl-10 w-full'>
            {/* Navbar menu */}
            {/* user is signed-in and has username */}
            {username && <NavbarMenu page={page} menu={navbarProperty} />}
            {/* Login or Register */}
            {/* user is not signed OR has not created username */}
            {!username && <Login login='/login' register='/register' />}
          </div>
          <div className='lg:hidden flex justify-end pl-10 w-full'>
            {!username && (
              <div
                className='justify-end gap-2 text-white'
                onClick={() => setToggle(!toggle)}
              >
                <LoginRegisterSmallScreen
                  login='/enter'
                  register='/register'
                  toggle={toggle}
                />
              </div>
            )}
          </div>
          {username && (
            <div
              className='justify-end gap-2 text-white'
              onClick={() => setToggle(!toggle)}
            >
              <DropdownMenu
                user={userData}
                isBusy={isBusy}
                toggle={toggle}
                signOut={signOut}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

const DropdownMenu = ({ user, isBusy, signOut }) => {
  const { username } = useContext(UserContext);

  const settingMenuProperty = [
    {
      name: 'โปรไฟล์',
      link: `/${username}`,
      icon: <Users size={14} />,
    },
    {
      name: 'ตั้งค่า',
      link: '/setting',
      icon: <Settings size={14} />,
    },
    {
      name: 'คำถามที่พบบ่อย',
      link: '/faq',
      icon: <ZoomQuestion size={14} />,
    },
  ];

  return (
    <Group position='center'>
      <div className='flex flex-row items-center gap-2'>
        <Link href={`/${username}`}>
          <a className='md:flex hidden flex-row gap-2 items-center cursor-pointer'>
            <Indicator
              inline
              size={12}
              offset={5}
              position='bottom-end'
              color={isBusy ? 'red' : 'green'}
              withBorder
            >
              <Avatar
                name={user?.username || 'ไม่พบข้อมูล'}
                src={user?.avatar}
                radius='xl'
              />
            </Indicator>
            <div style={{ flex: 1 }}>
              <div className='text-sm font-bold truncate text-title opacity-80'>
                {user?.username || 'ไม่พบข้อมูล'}
              </div>

              <Text color='dimmed' size='xs' className='truncate'>
                {user?.email || 'ยังไม่ได้ยืนยัน Email'}
              </Text>
            </div>
          </a>
        </Link>
        <Menu
          withArrow
          placement='end'
          shadow='md'
          classNames={{
            root: 'bg-foreground',
            body: 'bg-foreground border-background',
            itemHovered: 'bg-content',
            arrow: 'bg-foreground border-background',
          }}
        >
          <Menu.Label>ค้นหา</Menu.Label>
          <Link href='/search'>
            <Menu.Item
              className='hover:bg-content hover:text-[#fff]'
              icon={<Search size={14} />}
            >
              ค้นหา
            </Menu.Item>
          </Link>

          {/* Setting */}
          <Menu.Label>การตั้งค่า</Menu.Label>
          {settingMenuProperty &&
            settingMenuProperty.map((item, index) => (
              <Link href={item.link} key={index}>
                <Menu.Item
                  className='hover:bg-content hover:text-[#fff]'
                  icon={item.icon}
                >
                  {item.name}
                </Menu.Item>
              </Link>
            ))}
          {/* Pages */}
          <Menu.Label>การเข้าถึง</Menu.Label>
          {accessMenuProperty &&
            accessMenuProperty.map((item, index) => (
              <Link href={item.link} key={index}>
                <Menu.Item
                  className='hover:bg-content hover:text-[#fff]'
                  icon={item.icon}
                >
                  {item.name}
                </Menu.Item>
              </Link>
            ))}
          {/* Sign out */}
          <Menu.Label>ออกจากระบบ</Menu.Label>
          <Menu.Item
            icon={<Logout size={14} />}
            onClick={signOut}
            className='hover:bg-content hover:text-[#fff]'
            color='red'
          >
            ออกจากระบบ
          </Menu.Item>
        </Menu>
      </div>
    </Group>
  );
};
