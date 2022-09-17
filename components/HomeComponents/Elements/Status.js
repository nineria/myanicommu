import Link from 'next/link';
import React from 'react';
// Components
import Stats from './Stats';
// Icons
import { Messages } from 'tabler-icons-react';

export default function Status({ header, headerLink, body, date, post }) {
  return (
    <div className='flex lg:flex-row flex-col gap-2 lg:justify-between lg:items-start px-3 py-2 text-content bg-foreground overflow-hidden'>
      <div className='flex gap-2 items-center'>
        <Messages size={35} className='min-w-[35px] mr-1 md:mr-0' />
        <div
          className={`${
            body ? 'flex flex-col' : 'flex items-center'
          } overflow-hidden`}
        >
          {/* Header */}
          <Link href={headerLink}>
            <a className='flex items-center md:text-base text-sm text-title '>
              <span className='truncate cursor-pointer max-w-[700px] hover:underline'>
                {header}
              </span>
              <span className='ml-2 px-1 bg-content rounded-sm text-white text-xs'>
                New
              </span>
            </a>
          </Link>
          {/* Body */}
          <p className='text-title truncate opacity-50 md:text-sm text-xs max-w-[650px]'>
            {body}
          </p>
        </div>
      </div>
      {/* Stat */}
      <Stats>
        <Stats.Posts>{post?.posts.length || 1}</Stats.Posts>
        <Stats.Comments>{post?.comments.length || 1}</Stats.Comments>
        <Stats.EditDate>{date}</Stats.EditDate>
      </Stats>
    </div>
  );
}
