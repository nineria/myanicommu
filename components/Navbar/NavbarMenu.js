import Link from 'next/link';
import React from 'react';

export default function NavbarMenu({ page, menu }) {
  return (
    <div className='flex flex-row gap-3'>
      {menu.map((item) => (
        <Link key={item.name} href={item.path}>
          <div
            className={`py-2 px-2 text-base  ${
              item.path === page
                ? 'bg-opposite bg-opacity-90'
                : 'bg-transparent'
            }`}
          >
            <div className='truncate text-title font-bold cursor-pointer hover:underline'>
              {item.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
