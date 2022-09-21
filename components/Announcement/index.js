import Motion from '@components/Animate/Motion';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import AdminCheck from 'hooks/AdminCheck';
import { UserContext } from 'lib/context';
import { firestore } from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { AlertCircle, X } from 'tabler-icons-react';
import EditAnnouncement from './Edit';

export default function Announcement(props) {
  const { user } = useContext(UserContext);

  const modals = useModals();

  const router = useRouter();

  const [onClose, setOnClose] = useState(true);
  const [postRef, setPostRef] = useState();

  useEffect(() => {
    const uid = props.uid;
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('announcements')
      .doc(props.slug);
    setPostRef(ref);
  }, [props.uid, props.slug]);

  const handleDelete = () => {
    const handleOnClick = async () => {
      await postRef.delete();

      showNotification({
        color: 'red',
        title: 'ลบประกาศแล้ว',
        icon: <X size={18} />,
        classNames: {
          root: 'bg-foreground border-red-400',
        },
      });
      modals.closeModal(id);

      router.reload();
    };
    const id = modals.openModal({
      title: (
        <Stack>
          <Text size='sm'>คุณต้องการลบประกาศนี้หรือไม่?</Text>
          <Text size='xs'>การดำเนินการต่อไปนี้จะไม่สามารถกลับมาแก้ไขได้</Text>
        </Stack>
      ),
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
              size='xs'
              className='bg-background text-title hover:bg-background hover:opacity-75'
              onClick={() => modals.closeModal(id)}
            >
              ยกเลิก
            </Button>
            <Button
              type='submit'
              size='xs'
              className='bg-red-500 hover:bg-red-500 hover:opacity-75'
              onClick={() => handleOnClick()}
            >
              ยืนยัน
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  return (
    <Motion posY={10}>
      <div className='shadow-md'>
        {onClose ? (
          <div
            className={`${
              props.type === 'danger'
                ? 'border-red-500 bg-red-500'
                : props.type === 'warning'
                ? 'border-orange-500 bg-orange-500'
                : 'border-green-500 bg-green-500'
            } border-2 rounded-sm flex flex-row items-center`}
          >
            <div>
              <AlertCircle size={25} className='text-white m-1' />
            </div>
            <div className='relative flex flex-row px-2 text-title  w-full py-2 bg-foreground rounded-r-sm'>
              <div className='w-full'>
                <h1 className='font-bold md:text-base text-sm '>
                  {props.title}
                </h1>
                <p className='text-xs md:text-sm '>{props.content}</p>
              </div>
              <Group grow spacing='xs' className='absolute top-2 right-2'>
                {user && !props.disabled && (
                  <AdminCheck>
                    <div className='cursor-pointer bg-foreground'>
                      <EditAnnouncement {...props} postRef={postRef} />
                    </div>
                  </AdminCheck>
                )}
                <div className='cursor-pointer bg-foreground'>
                  {!props.disabled && user && (
                    <AdminCheck
                      fallback={
                        <X
                          size={18}
                          color='#aaa'
                          onClick={() => setOnClose(!onClose)}
                        />
                      }
                    >
                      <X size={18} color='#aaa' onClick={handleDelete} />
                    </AdminCheck>
                  )}
                </div>
              </Group>
            </div>
          </div>
        ) : null}
      </div>
    </Motion>
  );
}
