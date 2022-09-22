import ButtonControl from '@components/HomeComponents/ButtonControl';
import Content from '@components/HomeComponents/Content';
import Header from '@components/HomeComponents/Header';
import Title from '@components/HomeComponents/Title';
import WebsiteRule from '@components/WebsiteRule';
import { firestore, getUserWithUsername, serverTimestamp } from '@lib/firebase';
import { Divider, Stack } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Check } from 'tabler-icons-react';

export default function Edit(props) {
  const router = useRouter();

  const [posts] = useState(props.postData);

  const [postRef, setPostRef] = useState();

  useEffect(() => {
    const getPost = async () => {
      const userDoc = await getUserWithUsername(posts.username);
      const postRef = await userDoc.ref.collection('homePosts').doc(posts.slug);

      setPostRef(postRef);
    };

    getPost();
  }, [posts]);

  const HandleChange = async (values) => {
    const ref = firestore
      .collection('users')
      .doc(posts.uid)
      .collection('homePosts')
      .doc(posts.slug);

    await ref.update({
      title: values.title,
      titleLink: values.titleLink,
      header: values.header,
      headerLink: values.headerLink,
      body: values.body,
      updatedAt: serverTimestamp(),
    });

    showNotification({
      color: 'teal',
      title: 'แก้ไขโพสต์หลักแล้ว',
      icon: <Check size={18} />,
      classNames: {
        root: 'bg-foreground',
      },
    });

    props.setOpened(false);
    router.reload();
  };

  const form = useForm({
    initialValues: {
      title: posts.title,
      titleLink: posts.titleLink,
      header: posts.header,
      headerLink: posts.headerLink,
      body: posts.body,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => HandleChange(values))}>
      <Stack spacing='sm'>
        <Title
          titleLink={form.getInputProps('titleLink')}
          title={form.getInputProps('title')}
        />
        <Divider label='หัวข้อย่อย และเนื้อหา' labelPosition='center' />
        <Header
          headerLink={form.getInputProps('headerLink')}
          header={form.getInputProps('header')}
        />
        <Content body={form.getInputProps('body')} />
        <WebsiteRule />
        <ButtonControl setOpened={props.setOpened} postRef={postRef} />
      </Stack>
    </form>
  );
}
