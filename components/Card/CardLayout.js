// Components
import Loading from '@components/Loading';
import { Grid, Stack } from '@mantine/core';
import Card from 'components/Card';
import React, { useState } from 'react';
import { Animate } from 'react-simple-animate';

export default function CardLayout(props) {
  const [posts] = useState(props.posts);

  if (props.loading) return <Loading />;

  const postGrids = posts.map((data, index) => (
    <Grid.Col key={index} xs={6} md={4}>
      <Card layout={props.layout} posts={data} />
    </Grid.Col>
  ));

  const postStacks = posts.map((data, index) => (
    <Card key={index} layout={props.layout} posts={data} />
  ));

  return (
    <Animate
      play
      start={{ transform: 'translateY(2%)', opacity: '0' }}
      end={{ transform: 'translateY(0%)', opacity: '1' }}
    >
      {props.layout === 'grid' ? (
        <Grid gutter='xs'>{postGrids}</Grid>
      ) : (
        <Stack spacing={8}>{postStacks}</Stack>
      )}
    </Animate>
  );
}
