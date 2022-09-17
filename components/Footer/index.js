import Link from 'next/link';
// Components
import { ActionIcon, Container, Divider, Group, Text } from '@mantine/core';
// Icons, Logo
import MyAniLogo from 'components/Navbar/MyAniLogo';
import { UserContext } from 'lib/context';
import React, { useContext } from 'react';
import {
  BrandFacebook,
  BrandGithub,
  BrandInstagram,
  BrandTwitter,
} from 'tabler-icons-react';

export function Footer() {
  const { username } = useContext(UserContext);

  const data = [
    {
      title: 'ชุมชนคนรักอนิเมะ',
      links: [
        {
          label: 'โพสต์ใหม่',
          link: '/posts',
        },
        {
          label: 'ข่าวสาร',
          link: '/news',
        },
        {
          label: 'รีวิว',
          link: '/reviews',
        },
        {
          label: 'Q&A',
          link: '/qandas',
        },
      ],
    },
    {
      title: 'จัดการข้อมูล',
      links: [
        {
          label: 'โปรไฟล์',
          link: `/${username}`,
        },
        {
          label: 'ตั้งค่า',
          link: '/setting',
        },
        {
          label: 'คำถามที่พบบ่อย',
          link: '/faq',
        },
        {
          label: 'ออกจากระบบ',
          link: '#',
        },
      ],
    },
    {
      title: 'ข้อมูลเว็บไซต์',
      links: [
        {
          label: 'จำนวนโพสต์ : ' + '15',
          link: '#',
        },
        {
          label: 'จำนวนสมาชิก : ' + '6',
          link: '#',
        },
        {
          label: '-',
          link: '#',
        },
        {
          label: '-',
          link: '#',
        },
      ],
    },
  ];

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={`flex mt-1 flex-col text-sm text-title opacity-50 text-right`}
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        <Link href={link.link}>
          <a className='hover:underline'>{link.label}</a>
        </Link>
      </Text>
    ));

    return (
      <div className='lg:w-[200px] w-[150px]' key={group.title}>
        <Text
          className={`text-base font-bold text-title opacity-80 text-right`}
        >
          {group.title}
        </Text>
        {links}
      </div>
    );
  });

  return (
    <footer className='fixed bottom-0 pt-4 md:pt-8 bg-foreground mt-10 h-[235px] -z-10 w-full border-t-2 border-content'>
      <Container size='md' className='flex md:justify-between justify-center'>
        <div className='w-[250px] md:text-left text-center'>
          <div className='text-3xl font-bold'>
            <MyAniLogo link='/' />
          </div>
          <Text
            size='sm'
            className={`my-2 md:text-left text-center text-title opacity-80`}
          >
            ศูนย์กลางในการพูดคุย รีวิว และโพสต์ถามตอบคำถามต่างๆ
            ที่เกี่ยวกับอนิเมะ โปรโมทอนิเมะ
            และแนะนำเนื้อหาของอนิเมะเพื่อส่งเสริมให้ผู้คนดูอนิเมะมากขึ้น
          </Text>
        </div>
        <div className='md:flex hidden'>{groups}</div>
      </Container>
      <Container size='md'>
        <Divider my='xs' color='dark' />
      </Container>
      <Container
        size='md'
        className='flex flex-col md:flex-row md:justify-between items-center'
      >
        <Text className='text-title opacity-80' size='sm'>
          &copy; {new Date().getFullYear()} MyAnimeCommunity. All rights
          reserved.
        </Text>

        <Group spacing={0} className='' position='right' noWrap>
          <a
            href='https://twitter.com/nineria_nananai'
            target='_blank'
            rel='noreferrer'
          >
            <ActionIcon size='lg'>
              <BrandTwitter size={18} className='text-title' />
            </ActionIcon>
          </a>
          <a
            href='https://www.facebook.com/NineriaNananai'
            target='_blank'
            rel='noreferrer'
          >
            <ActionIcon size='lg'>
              <BrandFacebook size={18} className='text-title' />
            </ActionIcon>
          </a>
          <a
            href='https://www.instagram.com/ninerianananai'
            target='_blank'
            rel='noreferrer'
          >
            <ActionIcon size='lg'>
              <BrandInstagram size={18} className='text-title' />
            </ActionIcon>
          </a>
          <a href='https://github.com/nineria' target='_blank' rel='noreferrer'>
            <ActionIcon size='lg'>
              <BrandGithub size={18} className='text-title' />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </footer>
  );
}
