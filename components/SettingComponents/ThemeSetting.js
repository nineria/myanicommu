import Post from '@components/HomeComponents/Body';
import { LOCAL_THEME } from '@constants/Themes';
import {
  Box,
  Button,
  Center,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useThemeContext } from 'lib/useTheme';
import { useRouter } from 'next/router';
import React, { forwardRef, useMemo, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

const getCurrentTheme = (theme) => {
  const result = LOCAL_THEME.filter((item) => {
    let _tmp = theme.split('-');
    if (item.value == _tmp[0]) return true;
    else return false;
  });
  return result[0];
};

const getSplitTheme = (theme) => {
  let _tmp = theme.split('-');
  return _tmp[0];
};

export default function ThemeSetting(props) {
  const { theme } = useThemeContext();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  const currentTheme = useMemo(() => getCurrentTheme(theme), [theme]);
  const splitTheme = useMemo(() => getSplitTheme(theme), [theme]);

  const [mode, setMode] = useState(colorScheme);
  const [value, setValue] = useState(theme);
  const [defaultValue, setDefaultValue] = useState('');

  const router = useRouter();

  const handleChangeTheme = (value) => {
    setValue(mode === 'light' ? `${value}-${mode}` : value);
    setDefaultValue(value);
  };

  const handleChangeMode = (mode) => {
    setMode(mode);
    const _tmp = value.split('-');
    setValue(mode === 'light' ? `${value}-${mode}` : _tmp[0]);
    setDefaultValue(_tmp[0]);
  };

  const handleSubmit = () => {
    const setLocalTheme = {
      label: value,
      mode: mode,
    };

    if (value === 'light') toggleColorScheme('light');
    else toggleColorScheme('dark');

    localStorage.setItem('themes', JSON.stringify(setLocalTheme));

    router.reload();
  };

  const SelectItem = forwardRef(({ label, color, value }, ref) => (
    <div
      ref={ref}
      className='hover:bg-content text-title hover:text-[#fff] px-2 cursor-pointer'
      onClick={() => handleChangeTheme(value)}
    >
      <Group noWrap p={4}>
        <Group noWrap>
          <div className='flex flex-col rotate-45 rounded-full border-2 border-title '>
            <div
              style={{ backgroundColor: color }}
              className='h-2 w-4 rounded-tl-full rounded-tr-full'
            />
            <div
              style={{ backgroundColor: mode === 'light' ? '#fff' : '#222' }}
              className='h-2 w-4 rounded-bl-full rounded-br-full'
            />
          </div>
        </Group>
        <Text size='sm'>{label}</Text>
      </Group>
    </div>
  ));
  SelectItem.displayName = 'SelectItem';

  const ResultSample = ({ posts }) => (
    <div className='bg-foreground px-4 py-2'>
      <div className='bg-background p-4 rounded-sm'>
        <div className='flex flex-col gap-2'>
          {posts &&
            posts.map((item, index) => (
              <Post homePosts={item} key={index} disabled={true} />
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='bg-foreground my-2 w-full rounded-sm shadow-md'>
      <div className='px-4 py-2 flex flex-col md:flex-row justify-between items-center'>
        <div className='text-title'>
          <Text className='font-bold '>การตั้งค่า</Text>
          <Text size='xs' className='font-bold opacity-50'>
            ธีมปัจจุบัน : {currentTheme?.label}
          </Text>
        </div>

        <Stack className='w-[50%] mt-6 md:mt-0'>
          {/* Select Theme */}
          <SegmentedControl
            value={mode}
            onChange={(value) => handleChangeMode(value)}
            data={[
              {
                value: 'light',
                label: (
                  <Center>
                    <BsFillSunFill size={16} />
                    <Box ml={10}>Light</Box>
                  </Center>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Center>
                    <BsFillMoonStarsFill size={16} />
                    <Box ml={10}>Dark</Box>
                  </Center>
                ),
              },
            ]}
          />
          <Select
            placeholder='เลือกธีม'
            itemComponent={SelectItem}
            data={LOCAL_THEME}
            searchable
            value={defaultValue === '' ? splitTheme : defaultValue}
            maxDropdownHeight={400}
            nothingFound='ไม่พบธีมที่ต้องการ'
            filter={(value, item) => {
              if (item.label == value) return true;
              else return false;
            }}
            classNames={{
              dropdown:
                'bg-foreground border-title border-opacity-20 border-[1px]',
              nothingFound: 'bg-foreground text-title',
              input: 'bg-background text-title',
            }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            className='bg-content text-[#fff]  hover:bg-content hover:opacity-75'
            onClick={() => handleSubmit()}
          >
            เปลี่ยนธีม
          </Button>
        </Stack>
      </div>
      {/* Option menu result changed example */}
      <ResultSample posts={props.posts} />
    </div>
  );
}
