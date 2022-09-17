import { Footer } from '@components/Footer';
import Metatags from '@components/Metatags';
import Navbar from '@components/Navbar';
import { FAQ_FIRST_LIST, FAQ_LIST } from '@constants/FAQ';
import {
  Accordion,
  Card,
  Container,
  createStyles,
  Stack,
  Title,
} from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme, _params, getRef) => ({
  icon: { ref: getRef('icon') },

  control: {
    ref: getRef('control'),
    border: 0,
    opacity: 0.6,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    '&:hover': {
      backgroundColor: 'transparent',
      opacity: 1,
    },
  },

  item: {
    borderBottom: 0,
    overflow: 'hidden',
    transition: `box-shadow 150ms ${theme.transitionTimingFunction}`,
    border: '1px solid transparent',
    borderRadius: theme.radius.sm,
  },

  itemOpened: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[3],

    [`& .${getRef('control')}`]: {
      opacity: 1,
    },

    [`& .${getRef('icon')}`]: {
      transform: 'rotate(45deg)',
    },
  },

  content: {
    paddingLeft: 0,
  },
}));

export default function FaqPage() {
  const { classes } = useStyles();

  const FirstFaqLists = FAQ_FIRST_LIST.map((data, index) => (
    <div key={index}>
      <Title order={4} mt='lg' mb='xs'>
        {data.title}
      </Title>
      <Accordion iconPosition='left' classNames={classes}>
        {data.description.map((item, index) => (
          <Accordion.Item key={index} label={item.label}>
            {item.content}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  ));

  const FaqLists = FAQ_LIST.map((data, index) => (
    <Card key={index} className='bg-foreground'>
      <Title order={4} mt='lg' mb='xs'>
        {data.title}
      </Title>
      <Accordion iconPosition='left' classNames={classes}>
        {data.description.map((item, index) => (
          <Accordion.Item key={index} label={item.label}>
            {item.content}
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  ));

  return (
    <div className='bg-background text-accent min-h-[1024px] mb-[235px] pb-10'>
      <Navbar isBusy />
      <Metatags />

      <Container size='md'>
        <Stack spacing='xs'>
          <Card className='bg-foreground'>
            <Title order={2} align='center'>
              คำถามที่พบบ่อย
            </Title>
            {FirstFaqLists}
          </Card>
          {FaqLists}
        </Stack>
      </Container>
      <Footer />
    </div>
  );
}
