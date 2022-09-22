import { UserContext } from '@lib/context';
import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Space,
  Stack,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { auth, firestore, serverTimestamp } from 'lib/firebase';
import React, { useContext, useState } from 'react';
import { AlertTriangle, Check, X } from 'tabler-icons-react';
import WebsiteRuleReadOnly from './WebsiteRule/readOnly';

export default function UserReport({ size = 'md', from, title }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username } = useContext(UserContext);

  const form = useForm({
    initialValues: {
      inappropriateUsername: false,
      inappropriateVerbUse: false,
      advertisement: false,
      hateSpeech: false,
      contentGotUpdated: false,
      other: '',
    },
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const uid = auth.currentUser.uid;
      const ref = firestore.collection('reports').doc();

      const data = {
        reporterUsername: username,
        reporterUid: uid,
        id: ref.id,
        title,
        from,
        detail: {
          inappropriateUsername: values.inappropriateUsername,
          inappropriateVerbUse: values.inappropriateVerbUse,
          advertisement: values.advertisement,
          hateSpeech: values.hateSpeech,
          contentGotUpdated: values.contentGotUpdated,
          other: values.other,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log(data);
      await ref.set(data);

      showNotification({
        color: 'teal',
        title: 'แจ้งรายงานแล้ว',
        icon: <Check size={18} />,
        classNames: {
          root: 'bg-foreground border-l-teal-400 border-l-4',
        },
      });
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
      setLoading(false);
      setOpened(false);
    }
  };

  return (
    <>
      <Modal
        size='lg'
        opened={opened}
        onClose={() => setOpened(false)}
        title='เหตุผลที่รายงาน'
        centered
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
          <Stack spacing='sm'>
            <Checkbox
              label='ชื่อผู้ใช้ไม่เหมาะสม'
              {...form.getInputProps('inappropriateUsername')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
            />
            <Checkbox
              label='ใช้วาจาไม่เหมาะสม / ทัศนคติเชิงลบ'
              {...form.getInputProps('inappropriateVerbUse')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
            />
            <Checkbox
              label='โฆษณาขายของ / การสแปมข้อความ'
              {...form.getInputProps('advertisement')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
            />
            <Checkbox
              label='คำพูดแสดงถึงความเกลียดชัง'
              {...form.getInputProps('hateSpeech')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
            />
            <Checkbox
              label='เนื้อหามีการอัพเดท'
              {...form.getInputProps('contentGotUpdated')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
            />
            <Textarea
              placeholder='โปรดระบุ'
              label='อื่นๆ'
              {...form.getInputProps('other')}
              classNames={{
                input: 'bg-accent border-title border-opacity-20 border-[1px]',
              }}
              minRows={2}
              autosize
            />
          </Stack>
          <Space />
          <WebsiteRuleReadOnly />
          <Group position='center' mt='sm'>
            <Button
              className='bg-background text-title hover:bg-background hover:opacity-75'
              variant='default'
              size='xs'
              onClick={() => setOpened(false)}
            >
              ยกเลิก
            </Button>
            <Button
              type='submit'
              className='bg-content text-[#fff] hover:bg-content hover:opacity-75'
              variant='default'
              size='xs'
              // onClick={() => setOpened(false)}
            >
              ส่งเรื่อง
            </Button>
          </Group>
        </form>
      </Modal>
      <Button
        className='border-none text-title hover:bg-[#ff3333] hover:text-[#fff]'
        compact
        variant='default'
        leftIcon={<AlertTriangle size={14} />}
        onClick={() => setOpened(true)}
        size={size}
      >
        แจ้งรายงาน
      </Button>
    </>
  );
}
