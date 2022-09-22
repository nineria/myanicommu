import { Modal } from '@mantine/core';
import AdminCheck from 'hooks/AdminCheck';
import { UserContext } from 'lib/context';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { ChevronUp, Edit as EditIcon } from 'tabler-icons-react';
import Edit from './Edit';
import Status from './Status';

export default function Body({
  today,
  post,
  disabled,
  homePosts,
  setHomePosts,
}) {
  const { user } = useContext(UserContext);
  const [toggle, setToggle] = useState(true);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(post.title) == null) {
      localStorage.setItem(post?.title | 'title', JSON.stringify(toggle));
    } else {
      var getIsToggle = localStorage.getItem(post.title);
      setToggle(JSON.parse(getIsToggle));
    }
  }, [post.title, toggle]);

  const date =
    post.createdAt && new Date(post.createdAt * 1000).toLocaleDateString();

  const handleToggle = (toggle) => {
    localStorage.setItem(post.title, JSON.stringify(toggle));
    setToggle(toggle);
  };

  const todaysPosts =
    today &&
    post.map((item, index) => {
      const regex = /(<([^>]+)>)/gi;
      const description = item.content.replace(regex, '');
      const link = `posts/${item.username}/${item.slug}`;

      const updatedAt =
        typeof item?.updatedAt === 'number'
          ? new Date(item.updatedAt)
          : item?.updatedAt?.toDate();

      const date = updatedAt?.toLocaleDateString('th-th', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return (
        <Status
          key={index}
          header={item?.title || 'หัวข้อย่อย'}
          headerLink={item?.headerLink || link}
          body={item?.body || description}
          date={date}
          disabled={disabled}
          post={{
            posts: {
              length: 1,
            },
            comments: {
              length: 1,
            },
          }}
        />
      );
    });

  return (
    <div className='rounded-sm shadow-md'>
      <div
        className={`bg-foreground  border-content border-opacity-30 flex flex-row justify-between items-center transition-all py-1 px-3 font-bold md:text-base text-sm text-title ${
          toggle === true ? 'rounded-t-sm border-b-2' : 'rounded-sm border-b-0'
        }`}
      >
        <Link href={post?.titleLink || '/'}>
          <a className='truncate text-title  max-w-[600px] cursor-pointer hover:underline'>
            {today ? 'TOP รีวิว' : post?.title || 'หัวข้อหลัก'}
          </a>
        </Link>
        <div className='flex flex-row gap-2 '>
          {user && (
            <div>
              <Modal
                size='lg'
                opened={opened}
                onClose={() => setOpened(false)}
                closeOnClickOutside={false}
                title='แก้ไขโพสต์ - หน้าหลัก'
                centered
                classNames={{
                  modal: 'bg-foreground',
                  overlay: 'bg-background',
                  title: 'text-title',
                }}
              >
                <Edit
                  setOpened={setOpened}
                  postData={post}
                  homePosts={homePosts}
                  setHomePosts={setHomePosts}
                />
              </Modal>
              {!disabled && !today && (
                <AdminCheck>
                  <EditIcon
                    onClick={() => setOpened(true)}
                    className='hover:translate-y-[1px] hover:opacity-75 cursor-pointer'
                  />
                </AdminCheck>
              )}
            </div>
          )}
          <ChevronUp
            size={22}
            onClick={() => handleToggle(!toggle)}
            className={`${
              !toggle ? 'rotate-180' : ''
            } cursor-pointer transition-all hover:translate-y-[1px] hover:opacity-75`}
          />
        </div>
      </div>
      {today ? (
        <div className='flex flex-col bg-[#aaa] gap-[1px]'>
          {toggle && todaysPosts}
        </div>
      ) : (
        <div className='flex flex-col bg-[#aaa] gap-[1px]'>
          {toggle && (
            <Status
              header={post?.title || 'หัวข้อย่อย'}
              headerLink={post?.headerLink || '/'}
              body={post?.body || 'เนื้อหา'}
              date={date}
              disabled={disabled}
              post={{
                posts: {
                  length: 1,
                },
                comments: {
                  length: 1,
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
