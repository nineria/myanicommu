import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
// Context
import { auth, facebookAuthProvider, googleAuthProvider } from 'lib/firebase';
// Components
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
// Icons
import { showNotification } from '@mantine/notifications';
import { UserContext } from 'lib/context';
import { useRouter } from 'next/router';
import { Mail, X } from 'tabler-icons-react';
import { RegisterForm } from './RegisterForm';

export function LoginPopUp({ setOpenedRegister, mobile = false }) {
  const router = useRouter();
  const { user, username } = useContext(UserContext);
  const [noUsername, setNoUsername] = useState(false);
  const [usernameMobile, setUsernameMobile] = useState(false);

  useEffect(() => {
    if (user && !username) {
      showNotification({
        color: 'red',
        title:
          'กรุณากำหนดชื่อผู้ใช้ของคุณก่อนเข้าใช้งานเว็บไซต์ MyAnimeCommunity',
        icon: <X size={18} />,
        classNames: {
          root: 'bg-foreground border-l-red-400 border-l-4',
        },
        autoClose: 9000,
      });
      setNoUsername(true);
    }
  }, []);

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider).catch((e) => {
      if (e.code == 'auth/popup-blocked') {
        auth.signInWithRedirect(googleAuthProvider);
      } else {
        console.error(e.code);
        router.push('/');
      }
    });

    if (mobile) setUsernameMobile(true);

    try {
      if (!username) setOpenedRegister(true);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithFacebook = async () => {
    await auth.signInWithPopup(facebookAuthProvider).catch((e) => {
      if (e.code == 'auth/popup-blocked') {
        auth.signInWithRedirect(facebookAuthProvider);
      } else {
        console.error(e.code);
        router.push('/');
      }
    });

    if (mobile) setUsernameMobile(true);

    try {
      if (!username) setOpenedRegister(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (noUsername || usernameMobile) {
    return <RegisterForm />;
  }

  return (
    <Stack>
      {!noUsername && (
        <>
          <Group position='center' noWrap>
            <Button
              size='sm'
              radius='lg'
              className='bg-white w-[200px] text-black border-[1px] border-gray-300  hover:bg-white hover:opacity-75  md:mr-0'
              onClick={signInWithGoogle}
            >
              <Image
                src='/google-logo.png'
                alt='google'
                width='15px'
                className='mr-2'
              />
              Google
            </Button>
            <Button
              size='sm'
              radius='lg'
              className='bg-white w-[200px] text-black border-[1px] border-gray-300 hover:bg-white hover:opacity-75'
              onClick={signInWithFacebook}
            >
              <Image
                src='/facebook-logo.png'
                alt='facebook'
                width='15px'
                className='mr-2'
              />
              Facebook
            </Button>
          </Group>
          <Divider label='หรือดำเนินการต่อด้วยอีเมล' labelPosition='center' />
          <TextInput
            disabled
            required
            label='อีเมล (Email)'
            icon={<Mail size={20} />}
            placeholder='อีเมลของคุณ'
            classNames={{
              input: 'bg-accent border-title border-opacity-20 border-[1px]',
            }}
          />
          <PasswordInput
            disabled
            required
            label='รหัสผ่าน'
            placeholder='รหัสผ่านของคุณ'
            classNames={{
              input: 'bg-accent border-title border-opacity-20 border-[1px]',
            }}
          />
          <Checkbox
            disabled
            label='จดจำฉันไว้ในครั้งถัดไป'
            className='content-checkbox my-2 md:my-0'
          />
          <Link href='/'>
            <Button
              disabled
              size='sm'
              fullWidth
              className='bg-content hover:bg-content hover:opacity-75'
            >
              เข้าสู่ระบบ
            </Button>
          </Link>
          {/* <Group noWrap className='text-white p-2 mt-4 md:mt-0 bg-[#ff3333]'>
            <AlertTriangle width={34} className='m-2 md:m-0' />
            <Text size='xs'>
              ขออภัยในความไม่สะดวก - ทางเว็บไซต์ MyAnimeCommunity
              ขอปิดปรับปรุงการเข้าสู่ระบบ และลงทะเบียนด้วย อีเมล ชั่วคราว
            </Text>
          </Group>
          <Text size='xs' className='mt-4 md:mt-0'>
            ผู้ใช้ที่ต้องการเข้าสู่ระบบโปรดลงชื่อเข้าใช้ด้วย Google หรือ
            Facebook
          </Text> */}
        </>
      )}
    </Stack>
  );
}
