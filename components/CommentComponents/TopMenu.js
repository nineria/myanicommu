import { Avatar, Text } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export default function TopMenu({ comment }) {
  const timestamp = new Date(comment.createdAt.seconds * 1000);

  const date = timestamp?.toLocaleDateString('th-th', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className='absolute p-2'>
      <div className='flex flex-row items-center gap-2'>
        <Link href={`/${comment.username}`}>
          <Avatar
            radius='xl'
            size='md'
            src={comment?.avatar}
            alt={comment?.username}
            className='cursor-pointer'
          />
        </Link>

        <div className='flex flex-col'>
          <div className='flex flex-row items-center'>
            <Link href={`/${comment.username}`}>
              <Text
                color='red'
                className='md:text-base text-sm cursor-pointer hover:underline mr-2'
              >
                {comment?.username}
              </Text>
            </Link>
            <p
              className={`${
                comment?.rule === 'ผู้ดูแลระบบ'
                  ? 'text-yellow-400'
                  : 'text-title'
              } text-xs`}
            >
              {comment?.rule}
            </p>
          </div>
          <div className='flex flex-row items-center text-xs gap-2'>
            {comment.createdAt?.seconds !== comment.updatedAt?.seconds &&
              'แกไขล่าสุด'}{' '}
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}
