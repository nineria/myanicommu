import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

export default function ADSide() {
  const router = useRouter();
  return (
    <div className='fixed top-16 left-0 right-0 bg-red-400 w-[1260px] mx-auto'>
      <div className='absolute cursor-pointer hidden xl:block right-0  w-[160px] h-[480px] '>
        <Image
          onClick={() => router.push('/')}
          src='/image/AD_02.png'
          alt='AD-01'
          layout='responsive'
          width={180}
          height={480}
        />
      </div>
      <div className='absolute cursor-pointer hidden xl:block left-0 w-[160px] h-[480px] '>
        <Image
          onClick={() => router.push('/')}
          src='/image/AD_02.png'
          alt='AD-01'
          layout='responsive'
          width={180}
          height={480}
        />
      </div>
    </div>
  );
}
