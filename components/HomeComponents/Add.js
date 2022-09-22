import ButtonControl from '@components/HomeComponents/ButtonControl';
import Content from '@components/HomeComponents/Content';
import Header from '@components/HomeComponents/Header';
import Title from '@components/HomeComponents/Title';
import { Divider, Stack } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import WebsiteRule from 'components/WebsiteRule';
import { UserContext } from 'lib/context';
import { auth, firestore, serverTimestamp } from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Check, X } from 'tabler-icons-react';

export default function Add({ setOpened }) {
  const { username } = useContext(UserContext);

  const router = useRouter();

  const HandleChange = async (values) => {
    try {
      const uid = auth.currentUser.uid;
      const ref = firestore
        .collection('users')
        .doc(uid)
        .collection('homePosts')
        .doc();

      const data = {
        uid: uid,
        slug: ref.id,
        username: username,
        title: values.title,
        titleLink: values.titleLink,
        header: values.header,
        headerLink: values.headerLink,
        body: values.body,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      showNotification({
        color: 'teal',
        title: 'สร้างโพสต์แล้ว',
        icon: <Check size={18} />,
        classNames: {
          root: 'bg-foreground border-l-teal-400 border-l-4',
        },
      });

      await ref.set(data);
    } catch {
      showNotification({
        color: 'red',
        title: 'มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง',
        icon: <X size={18} />,
        classNames: {
          root: 'bg-foreground border-l-red-400 border-l-4',
        },
      });
    } finally {
      setOpened(false);
      router.reload();
    }
  };

  const form = useForm({
    initialValues: {
      title: '',
      titleLink: '',
      header: '',
      headerLink: '',
      body: '',
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
        <ButtonControl setOpened={setOpened} type='add' />
      </Stack>
    </form>
  );
}
