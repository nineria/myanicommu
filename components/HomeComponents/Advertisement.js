import { ADVERTISEMENT } from '@constants/Advertisement';
import { Grid, Image } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { uid } from 'react-uid';

export default function Advertisement() {
  const router = useRouter();
  return (
    <Grid columns={2} gutter='xs'>
      {ADVERTISEMENT.map((item) => (
        <Grid.Col key={uid(item)} xs={2} sm={1}>
          <Image
            onClick={() => router.push(item.href)}
            src={item.image.src}
            alt={item.image.alt}
            style={{
              cursor: 'pointer',
            }}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
