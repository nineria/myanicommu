import { LoginPopUp } from '@components/LoginRegister/LoginPopUp';
import { Menu } from '@mantine/core';
import React from 'react';

export default function LoginRegisterSmallScreen() {
  return (
    <Menu withArrow placement='end' size='xl' p='sm'>
      <LoginPopUp mobile />
    </Menu>
  );
}
