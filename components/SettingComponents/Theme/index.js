import {
  Button,
  Group,
  Select,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useThemeContext } from 'lib/useTheme';
import { useRouter } from 'next/router';
import React, { forwardRef, useMemo, useState } from 'react';
import ResultSample from './ResultSample';

const localTheme = [
  {
    color: ['bg-[#ec5555]', 'bg-[#181a1d]'],
    label: 'ROSE',
    value: 'red',
    description: 'Dark theme',
    mode: 'dark',
  },
  {
    color: ['bg-[#ff7315]', 'bg-[#232020]'],
    label: 'TIGER',
    value: 'tiger',
    description: 'Dark theme',
    mode: 'dark',
  },
  {
    color: ['bg-[#3382b8]', 'bg-[#1b262c]'],
    label: 'NAVY BLUE',
    value: 'navy',
    description: 'Dark theme',
    mode: 'dark',
  },
  {
    color: ['bg-[#ff5d8d]', 'bg-[#323232]'],
    label: 'PINKY SWEAR',
    value: 'pinky',
    description: 'Dark theme',
    mode: 'dark',
  },
  {
    color: ['bg-[#00adb5]', 'bg-[#222831]'],
    label: 'Cyberpunk',
    value: 'punk',
    description: 'Dark theme',
    mode: 'dark',
  },
  {
    color: ['bg-[#ec5555]', 'bg-[#eeeeee]'],
    label: 'MOON ROSE',
    value: 'red-light',
    description: 'Light theme',
    mode: 'light',
  },
];

const getCurrentTheme = (theme) => {
  const result = localTheme.filter((item) => item.value == theme);
  return result[0];
};

export default function Themes(props) {
  const { theme } = useThemeContext();
  const [newTheme, setNewTheme] = useState(null);
  const router = useRouter();

  const currentTheme = useMemo(() => getCurrentTheme(theme), [theme]);

  useMemo(() => {}, []);

  const { toggleColorScheme } = useMantineColorScheme();

  const handleChangeTheme = (value, mode) => {
    setNewTheme({
      label: value,
      mode: mode,
    });
  };

  const handleSubmit = () => {
    if (newTheme.mode === 'light') toggleColorScheme('light');
    else toggleColorScheme('dark');

    localStorage.setItem('themes', JSON.stringify(newTheme));

    router.reload();
  };

  // const filtered = localTheme.filter((item) => {
  //   return item.value === theme;
  // });

  const SelectItem = forwardRef(
    ({ label, description, color, value, mode }, ref) => (
      <div
        ref={ref}
        className='hover:bg-content text-title hover:text-[#fff] px-2 cursor-pointer'
        onClick={() => handleChangeTheme(value, mode)}
      >
        <Group noWrap>
          <div className='flex flex-col rotate-45 rounded-full border-2 border-white'>
            <div
              className={`h-2 w-4 ${color[0]} 
            rounded-tl-full rounded-tr-full`}
            />
            <div
              className={`h-2 w-4 ${color[1]} 
            rounded-bl-full rounded-br-full`}
            />
          </div>
          <div>
            <Text size='sm'>{label}</Text>
            <Text size='xs' color='dimmed'>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  SelectItem.displayName = 'SelectItem';

  return (
    <div className='bg-foreground my-2 w-full rounded-sm shadow-md'>
      {/* Header */}

      {/* Theme */}
      <div className='px-4 py-2 flex flex-col md:flex-row justify-between items-center'>
        <div className='w-full text-title'>
          <Text className='font-bold '>การตั้งค่า</Text>
          <Text size='xs' className='font-bold opacity-50'>
            ธีมปัจจุบัน : {currentTheme.label}
          </Text>
        </div>

        <Group className='w-full mt-6 md:mt-0' spacing='xs' position='right'>
          {/* Select Theme */}
          <div className='w-[50%]'>
            <Select
              placeholder='เลือกธีม'
              itemComponent={SelectItem}
              data={localTheme}
              searchable
              value={newTheme?.label || theme}
              maxDropdownHeight={400}
              nothingFound='ไม่พบธีมที่ต้องการ'
              filter={(value, item) =>
                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.description
                  .toLowerCase()
                  .includes(value.toLowerCase().trim())
              }
              classNames={{
                dropdown: 'bg-foreground',
                nothingFound: 'bg-foreground text-title',
                wrapper: 'your-wrapper-class',
                invalid: 'your-invalid-class',
                input: 'bg-background text-title',
              }}
            />
          </div>
          {/* Submit Button */}
          <Button
            className='bg-content text-[#fff] ml-2 hover:bg-content hover:opacity-75'
            onClick={() => handleSubmit()}
          >
            เปลี่ยนธีม
          </Button>
        </Group>
      </div>
      {/* Option menu result changed example */}
      <ResultSample posts={props.posts} />
    </div>
  );
}
