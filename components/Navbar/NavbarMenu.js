import Link from 'next/link';
import React from 'react';

export default function NavbarMenu({ page, menu }) {
  return (
    <div className='flex flex-row gap-5 '>
      {menu.map((item) => (
        <Link key={item.name} href={item.path}>
          <div
            className={`border-b-4 text-base hover:border-b-4 hover:border-content ${
              item.path === page ? 'border-content' : 'border-transparent'
            }`}
          >
            <div className='truncate text-title font-bold cursor-pointer hover:text-title hover:opacity-75'>
              {item.name}
            </div>
          </div>
        </Link>
      ))}

      <Link href='/search'>
        <div
          className={`border-b-4 text-base hover:border-b-4 hover:border-content ${
            '/search' === page ? 'border-content' : 'border-transparent'
          }`}
        >
          <div className='truncate text-title font-bold cursor-pointer hover:text-title hover:opacity-75'>
            ค้นหา
          </div>
        </div>
      </Link>
    </div>
  );
}
