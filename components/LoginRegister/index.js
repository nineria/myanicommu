import { Button, Group, Modal, Text } from '@mantine/core';
import React, { useState } from 'react';
import { LoginPopUp } from './LoginPopUp';
import { RegisterPopUp } from './RegisterPopUp';

export default function LoginRegister({ center = false }) {
  const [openedLogin, setOpenedLogin] = useState(false);
  const [openedRegister, setOpenedRegister] = useState(false);

  return (
    <Group
      spacing={0}
      className={`${center ? 'justify-center gap-2' : 'justify-end'} w-full`}
    >
      <Modal
        centered
        size='md'
        opened={openedLogin}
        onClose={() => setOpenedLogin(false)}
        closeOnClickOutside={false}
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
        title={
          <Text size='lg' weight={500}>
            เข้าสู่ระบบ
          </Text>
        }
      >
        {/* Modal content */}
        {openedLogin && <LoginPopUp setOpenedRegister={setOpenedRegister} />}
      </Modal>
      <Button
        className='bg-content text-[#fff] hover:bg-content hover:opacity-75 mr-2'
        variant='default'
        onClick={() => setOpenedLogin(true)}
      >
        เข้าสู่ระบบ
      </Button>
      <Modal
        centered
        overlayColor='#333'
        size='lg'
        opened={openedRegister}
        onClose={() => setOpenedRegister(false)}
        closeOnClickOutside={false}
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
        title={
          <Text size='lg' weight={500} className='text-title'>
            ลงทะเบียน
          </Text>
        }
      >
        {/* Modal content */}
        {openedRegister && <RegisterPopUp />}
      </Modal>
      <Button
        className='bg-background text-title hover:bg-background hover:opacity-75'
        variant='default'
        onClick={() => setOpenedRegister(true)}
      >
        ลงทะเบียน
      </Button>
    </Group>
  );
}

export function UsernameMessage({ username, isValid, loading }) {
  if (loading) return <p className='text-xs'>กำลังตรวจสอบชื่อผู้ใช้...</p>;
  else if (isValid)
    return (
      <p className='text-green-400 text-xs'>
        ชื่อผู้ใช้ {username} สามารถใช้งานได้!
      </p>
    );
  else if (username && !isValid)
    return <p className='text-red-400 text-xs'>มีชื่อผู้ใช้แล้ว!</p>;
  else return <p></p>;
}
