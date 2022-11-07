import {
  Button,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';

import { auth, firestore } from 'lib/firebase';

import { useModals } from '@mantine/modals';
import { useRouter } from 'next/router';

export default function DeleteAccountForm({ user, setOpenedConfirm }) {
  const [usernameValid, setUsernameValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);
  const router = useRouter();

  const modals = useModals();

  const loginAgain = () => {
    const handleSignOut = async () => {
      await auth.signOut();
      modals.closeModal(id);
      router.push('/');
    };

    const id = modals.openModal({
      title: (
        <Stack>
          <Text size='sm'>
            คุณจำเป็นต้อง <b>เข้าสู่ระบบ</b> ใหม่อีกครั้งเพื่อยืนยันตัวตน
            และดำเนินการต่อ
          </Text>
          <Text size='xs'>
            (กรณีเข้าสู่ระบบอีกครั้งไม่ได้แสดงว่าบัญชีถูกลบไปแล้ว)
          </Text>
        </Stack>
      ),
      withCloseButton: false,
      zIndex: '999',
      centered: true,
      classNames: {
        modal: 'bg-foreground',
        overlay: 'bg-background',
      },
      size: 'sm',
      children: (
        <Stack size='xs'>
          <Group position='right'>
            <Button
              className='bg-background rounded-lg text-title hover:bg-background hover:opacity-75'
              onClick={() => {
                modals.closeModal(id);
                setOpenedConfirm(false);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              className='bg-red-500 rounded-lg hover:bg-red-500 hover:opacity-75'
              onClick={handleSignOut}
            >
              ออกจากระบบ
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  const deleteAccount = async () => {
    try {
      await firestore
        .collection('statistics')
        .doc(auth.currentUser.uid)
        .delete();
      await firestore.collection('usernames').doc(user.username).delete();
      await firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('ranks')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      await firestore.collection('users').doc(auth.currentUser.uid).delete();
      await auth.currentUser.delete();
      router.push('/');
    } catch (error) {
      console.log('ERROR => ', auth.currentUser.uid, error);
      loginAgain();
    }
  };

  const checkUsername = (e) => {
    if (e.target.value !== user.username) setUsernameValid(false);
    else setUsernameValid(true);
  };

  const checkConfirm = (e) => {
    if (e.target.value !== 'ลบบัญชีส่วนบุคคลของฉัน') setConfirmValid(false);
    else setConfirmValid(true);
  };

  return (
    <Stack spacing='xl'>
      <Stack>
        <Title order={2} align='center' mb='sm'>
          ลบบัญชีส่วนบุคคล
        </Title>
        <Text align='center'>
          MyAnimeCommunity จะลบบัญชี และข้อมูลส่วนบุคคลทั้งหมดของคุณ
          แต่โพสต์ของคุณอาจยังปรากฏอยู่
        </Text>
        <Text align='center'>
          MyAnimeCommunity แนะนำให้คุณลบโพสต์ทั้งหมดออกด้วยตนเองก่อนลบบัญชี
        </Text>
        <div className='bg-[#ff3333] py-2'>
          <Text align='center' color='white'>
            การดำเนินการนี้ไม่สามารถย้อนกลับได้ โปรดตรวจสอบให้แน่ใจ
          </Text>
        </div>
      </Stack>
      <Divider />
      <Stack>
        <Text>
          กรอกชื่อ <b>{user.username}</b> เพื่อดำเนินการต่อ:
        </Text>
        <TextInput onChange={checkUsername} />
        <Text>
          เพื่อทำการยืนยันพิมพ์ <b>ลบบัญชีส่วนบุคคลของฉัน</b> ด้านล่าง:
        </Text>
        <TextInput onChange={checkConfirm} />
      </Stack>
      <Stack size='xs'>
        <Group position='right'>
          <Button
            className='bg-background rounded-lg text-title hover:bg-background hover:opacity-75'
            onClick={() => setOpenedConfirm(false)}
          >
            ยกเลิก
          </Button>
          <Button
            disabled={usernameValid && confirmValid ? false : true}
            className='bg-[#ff3333] rounded-lg hover:bg-[#ff3333] hover:opacity-75'
            onClick={() => deleteAccount()}
          >
            ลบบัญชี
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
