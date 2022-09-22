import Link from 'next/link';
import React from 'react';
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
          <p className='text-title truncate opacity-50 md:text-sm text-xs max-w-[600px]'>
            {body}
          </p>
        </div>
      </div>
      {/* Stat */}
      <div className='flex flex-row gap-4 text-title min-w-[190px] mt-2 sm:mt-0'>
        <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
          <div>{post?.posts.length || 1}</div>
          <div className='text-xs text-title opacity-50 ml-1 sm:ml-0'>
            โพสต์
          </div>
        </div>
        <div className='lg:border-r-[1px] lg:border-[#aaa]' />
        <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
          <div>{post?.comments.length || 1}</div>
          <div className='text-xs text-title opacity-50 ml-1 sm:ml-0'>
            ข้อความ
          </div>
        </div>
        <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
          <span>แก้ไขล่าสุด</span>
          <span className='text-xs text-title opacity-50 ml-1 sm:ml-0 '>
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}
