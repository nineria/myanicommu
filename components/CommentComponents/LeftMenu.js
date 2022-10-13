import { Avatar, Text } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { CalendarMinus } from 'tabler-icons-react';

export default function LeftMenu({ comment }) {
  const timestamp = new Date(comment.createdAt?.seconds * 1000 || Date.now());

  const date = timestamp?.toLocaleDateString('th-th', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className='px-2 py-4 mt-2'>
      <div className='flex flex-col items-center w-[100px] '>
        <Link href={`/${comment.username}`}>
          <Avatar
            radius='xl'
            size='lg'
            src={comment?.avatar}
            alt={comment?.username}
            className='cursor-pointer border-[1px] border-white'
          />
        </Link>
        <div className='block  md:text-center text-left'>
          <Link href={`/${comment.username}`}>
            <Text
              color='red'
              className='md:text-base text-sm cursor-pointer hover:underline'
            >
              {comment?.username}
            </Text>
          </Link>
          <p
            className={`${
              comment?.rule === 'ผู้ดูแลระบบ' ? 'text-yellow-400' : 'text-title'
            } text-xs`}
          >
            {comment?.rule}
          </p>
        </div>
      </div>
      <div className='flex flex-col mt-4 text-title text-opacity-80'>
        <div className='flex flex-row items-center text-xs gap-2'>
          <CalendarMinus size={14} />
          <p>: {date}</p>
        </div>
      </div>
    </div>
  );
}
