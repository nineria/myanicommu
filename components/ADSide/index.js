import Image from 'next/image';
import React from 'react';

export default function ADSide() {
  return (
    <div className='fixed top-16 left-0 right-0 bg-red-400 w-[1310px] mx-auto'>
      <div className='absolute  hidden xl:block right-0  w-[180px] h-[580px] '>
        <Image
          src='/image/AD_01.png'
          alt='AD-01'
          layout='responsive'
          width={180}
          height={580}
        />
      </div>
      <div className='absolute hidden xl:block left-0 w-[180px] h-[580px] '>
        <Image
          src='/image/AD_01.png'
          alt='AD-01'
          layout='responsive'
          width={180}
          height={580}
        />
      </div>
    </div>
  );
}
