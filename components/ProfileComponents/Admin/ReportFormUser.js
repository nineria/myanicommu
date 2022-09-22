import { firestore } from '@lib/firebase';
import {
  Anchor,
  Button,
  Card,
  Center,
  createStyles,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Selector,
  X,
} from 'tabler-icons-react';

const useStyles = createStyles(() => ({
  th: {
    padding: '0 !important',
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className='w-full p-2 hover:bg-black/10'>
        <Group position='apart'>
          <Text weight={500} size='sm' className='text-title'>
            {children}
          </Text>
          <Center className='w-[21px] h-[21px]'>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const keys = Object.keys(data[0]);
  const query = search.toLocaleLowerCase().trim();

  return data.filter((item) =>
    keys.some((key) =>
      item[key]?.toString()?.toLocaleLowerCase()?.includes(query)
    )
  );
}

function sortData(data, payload) {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].toString().localeCompare(a[payload.sortBy]);
      }

      return a[payload.sortBy].toString().localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
}

export default function ReportFormUser({ reports }) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(reports);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(reports, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(reports, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const rows = sortedData.map((row) => {
    const createdAtTimestamp =
      typeof row?.createdAt === 'number'
        ? new Date(row.createdAt)
        : row.createdAt?.toDate();

    const createdAt = createdAtTimestamp?.toLocaleDateString('th-th', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <tr key={row.reporterUsername}>
        <td>
          <Anchor size='sm'>
            <Link href={`/${row.reporterUsername}`}>
              <a target='_blank' rel='noreferrer'>
                {row.reporterUsername}
              </a>
            </Link>
          </Anchor>
        </td>
        <td className='max-w-[350px]'>
          <Anchor size='sm'>
            <Link href={`/${row.from}`}>
              <a target='_blank' rel='noreferrer'>
                {row.title}
              </a>
            </Link>
          </Anchor>
        </td>
        <td>
          <Anchor size='sm'>
            <ReportDetail detail={row.detail} id={row.id} />
          </Anchor>
        </td>
        <td>{createdAt || '-'}</td>
      </tr>
    );
  });

  return (
    <Card p='md' radius='sm' className='bg-foreground'>
      <ScrollArea>
        <Text size='xl' weight={700} mb='sm'>
          รายงานจากผู้ใช้
        </Text>
        <TextInput
          placeholder='ค้นหา'
          mb='md'
          icon={<Search size={14} />}
          value={search}
          classNames={{
            input: 'bg-accent bg-opacity-50',
          }}
          onChange={handleSearchChange}
        />
        <Table
          highlightOnHover
          horizontalSpacing='md'
          verticalSpacing='xs'
          sx={{ minWidth: 800 }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === 'reporterUsername'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('reporterUsername')}
              >
                ผู้ใช้ที่แจ้งรายงาน
              </Th>
              <Th
                sorted={sortBy === 'title'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('title')}
              >
                ผู้ใช้ / โพสต์ / คอมเมอนต์ ที่ถูกรายงาน
              </Th>
              <Th
                sorted={sortBy === 'email'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('email')}
              >
                รายละเอียด
              </Th>
              <Th
                sorted={sortBy === 'createdAt'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('createdAt')}
              >
                รายงานเมื่อ
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={Object.keys(reports[0]).length}>
                  <Text weight={500} align='center' size='sm'>
                    ไม่พบรายการที่ค้นหา
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

function ReportDetail({ detail, id }) {
  const [opened, setOpened] = useState(false);

  const handleDelete = async () => {
    try {
      const reportRef = firestore.collection('reports').doc(id);
      await reportRef.delete();
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
      showNotification({
        color: 'teal',
        title: 'ลบรายงานแล้ว',
        icon: <Check size={18} />,
        classNames: {
          root: 'bg-foreground border-l-teal-400 border-l-4',
        },
      });
      setOpened(false);
    }
  };

  return (
    <>
      <Modal
        size='lg'
        opened={opened}
        onClose={() => setOpened(false)}
        title='รายละเอียด'
        centered
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
      >
        <Stack spacing='sm'>
          {detail.inappropriateUsername && (
            <Text size='sm'>- ชื่อผู้ใช้ไม่เหมาะสม</Text>
          )}
          {detail.inappropriateVerbUse && (
            <Text size='sm'>- ใช้วาจาไม่เหมาะสม / ทัศนคติเชิงลบ</Text>
          )}
          {detail.advertisement && (
            <Text size='sm'>- โฆษณาขายของ / การสแปมข้อความ</Text>
          )}
          {detail.hateSpeech && (
            <Text size='sm'>- คำพูดแสดงถึงความเกลียดชัง</Text>
          )}
          {detail.contentGotUpdated && (
            <Text size='sm'>- เนื้อหามีการอัพเดท</Text>
          )}
          {detail.other && (
            <Textarea
              readOnly
              autosize
              classNames={{
                input:
                  'bg-accent border-title border-opacity-20 border-[1px] focus: border-none',
              }}
            >
              {detail.other}
            </Textarea>
          )}
        </Stack>
        <Group position='center' mt='sm'>
          <Button
            className='bg-[#ff3333] text-title hover:bg-[#ff3333] hover:opacity-75'
            variant='default'
            size='xs'
            onClick={() => handleDelete()}
          >
            ลบ
          </Button>
          <Button
            className='bg-background text-title hover:bg-background hover:opacity-75'
            variant='default'
            size='xs'
            onClick={() => setOpened(false)}
          >
            ปิด
          </Button>
        </Group>
      </Modal>
      <Text
        weight={500}
        size='sm'
        className='text-title cursor-pointer hover:underline'
        onClick={() => setOpened(true)}
      >
        คลิกเพื่อดูรายละเอียด
      </Text>
    </>
  );
}
