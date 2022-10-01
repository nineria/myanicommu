import { DropzoneProfileAvatar } from '@components/Dropzone/DropzoneProfileAvatar';
import { DropzoneProfileImage } from '@components/Dropzone/DropzoneProfileImage';
import { Avatar, Card } from '@mantine/core';
import React from 'react';

export default function AvatarAndBanner({
  avatar,
  setAvatar,
  image,
  setImage,
  user,
}) {
  return (
    <Card p='md' radius='sm' className='bg-foreground'>
      <Card.Section
        sx={{
          backgroundImage: `url(${image || user.image})`,
          height: 260,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <DropzoneProfileImage setImage={setImage} />
      </Card.Section>
      <div className='relative w-fit mx-auto'>
        <Avatar
          src={avatar || user.avatar}
          size={120}
          radius={120}
          mt={-60}
          className='border-2 border-foreground'
        />
        <DropzoneProfileAvatar setImage={setAvatar} />
      </div>
    </Card>
  );
}
