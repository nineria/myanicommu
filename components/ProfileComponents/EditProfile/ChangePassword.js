import { InputWrapper, PasswordInput } from '@mantine/core';
import React from 'react';

export default function ChangePassword(props) {
  return (
    <>
      <InputWrapper label='รหัสผ่านเดิม'>
        <PasswordInput
          disabled
          {...props.password}
          placeholder='รหัสผ่านเดิมของคุณ'
          classNames={{
            input: 'bg-accent border-title border-opacity-20 border-[1px]',
          }}
        />
      </InputWrapper>
      <InputWrapper label='รหัสผ่านใหม่'>
        <PasswordInput
          disabled
          {...props.password}
          placeholder='รหัสผ่านใหม่เดิมของคุณ'
          classNames={{
            input: 'bg-accent border-title border-opacity-20 border-[1px]',
          }}
        />
      </InputWrapper>
    </>
  );
}
