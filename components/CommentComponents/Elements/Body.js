import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import AdminCheck from 'hooks/AdminCheck';
import AuthCheck from 'hooks/AuthCheck';
import AuthorCheck from 'hooks/AuthorCheck';
import { UserContext } from 'lib/context';
import { auth, firestore } from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Edit as EditIcon,
  ThumbUp,
  Trash,
  X,
} from 'tabler-icons-react';
import RichTextEditor from 'utils/RichText';
import Edit from '../Edit';

export default function Body({
  commentP,
  commentRef,
  post,
  likes,
  setLikes,
  likeState,
  setLikeState,
}) {
  const [comment] = useState(commentP);
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState(false);

  const { user } = useContext(UserContext);

  const modals = useModals();

  const router = useRouter();

  useEffect(() => {
    const timestamp = new Date(comment.updatedAt.seconds * 1000);

    const date = timestamp?.toLocaleDateString('th-th', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    setDate(date);
  }, [comment.updatedAt.seconds]);

  const handleLike = async () => {
    const uid = auth.currentUser.uid;

    let exist = false;
    let change = '';

    const userStatistics = firestore
      .collection('users')
      .doc(post.uid)
      .collection('posts')
      .doc(post.slug)
      .collection('comments')
      .doc(comment.slug)
      .collection('likes');

    const userStatisticsPosts = await (
      await userStatistics.get()
    ).docs.map((data) => data.data());

    userStatisticsPosts.map((like) => {
      if (like.uid === uid) {
        exist = true;
        change = like.slug;
        return;
      }
    });

    if (exist) {
      setLikeState(false);

      const userStatistics = firestore.collection('statistics').doc(uid);
      const userStatisticsPosts = (await userStatistics.get()).data();
      await userStatistics.update({
        likes: userStatisticsPosts.likes - 1,
      });

      const ref = firestore
        .collection('users')
        .doc(post.uid)
        .collection('posts')
        .doc(post.slug)
        .collection('comments')
        .doc(comment.slug)
        .collection('likes')
        .doc(change);

      await ref.delete();
      setLikes(likes - 1);
    } else {
      setLikeState(true);
      const userStatistics = firestore.collection('statistics').doc(uid);
      const userStatisticsPosts = (await userStatistics.get()).data();
      await userStatistics.update({
        likes: userStatisticsPosts.likes + 1,
      });

      const ref = firestore
        .collection('users')
        .doc(post.uid)
        .collection('posts')
        .doc(post.slug)
        .collection('comments')
        .doc(comment.slug)
        .collection('likes')
        .doc();

      await ref.set({
        slug: ref.id,
        like: 1,
        uid: uid,
      });

      setLikes(likes + 1);
    }
  };

  const handleAdminDelete = () => {
    const handleOnClick = async () => {
      const userStatistics = firestore
        .collection('statistics')
        .doc(comment.uid);
      const userStatisticsPosts = (await userStatistics.get()).data();
      await userStatistics.update({
        comments: userStatisticsPosts.comments - 1,
      });

      await commentRef.delete();

      showNotification({
        color: 'red',
        title: 'ลบคอมเมนต์แล้ว',
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
          <Text size='sm'>คุณต้องการลบคอมเมนต์นี้หรือไม่?</Text>
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
              className='bg-background text-title hover:bg-background hover:opacity-75'
              size='xs'
              onClick={() => modals.closeModal(id)}
            >
              ยกเลิก
            </Button>
            <Button
              type='submit'
              className='bg-red-500 hover:bg-red-500 hover:opacity-75'
              size='xs'
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
    <div className='relative mt-11 md:mt-0 text-title text-opacity-90 w-full min-h-[100px]'>
      <Modal
        size='xl'
        classNames={{
          modal: 'bg-foreground',
          overlay: 'bg-background',
          title: 'text-title',
        }}
        opened={opened}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title='แก้ไขคอมเมนต์'
      >
        <Edit
          commentP={comment}
          commentRef={commentRef}
          setOpened={setOpened}
          post={post}
        />
      </Modal>
      <Group position='apart'>
        {comment.createdAt?.seconds !== comment.updatedAt?.seconds ? (
          <p className='text-xs opacity-80 mb-2'>แกไขล่าสุด : {date}</p>
        ) : (
          <div />
        )}
        <Group spacing='xs' className='absolute md:top-2 -top-9 right-2 z-20'>
          <AuthorCheck username={comment.username}>
            <Button
              onClick={() => setOpened(true)}
              compact
              leftIcon={<EditIcon size={14} />}
              className='bg-foreground z-10 text-title hover:bg-content hover:text-[#fff]'
              variant='default'
              size='xs'
            >
              แก้ไข
            </Button>
          </AuthorCheck>
          {user && (
            <AdminCheck>
              <Button
                onClick={() => handleAdminDelete()}
                leftIcon={<Trash size={14} />}
                compact
                className='z-10 bg-red-500 text-[#fff] hover:bg-red-500 hover:opacity-75'
                variant='default'
                size='xs'
              >
                ลบเนื้อหา
              </Button>
            </AdminCheck>
          )}
        </Group>
      </Group>

      <RichTextEditor
        readOnly
        value={comment?.content}
        classNames={{
          root: 'bg-transparent border-none text-title z-10 mb-2 md:mt-6',
        }}
      />
      <AuthCheck fallback={<div />}>
        <Group
          position='apart'
          className='absolute bottom-0 right-0 left-0 text-xs z-10 '
          my='xs'
          mx='md'
        >
          <div className='flex flex-row gap-1 items-end hover:underline cursor-pointer '>
            <AlertTriangle size={14} />
            รายงานโพสต์
          </div>
          <Group position='right'>
            <div
              className={`flex flex-row gap-1 items-end hover:underline cursor-pointer ${
                likeState ? 'text-content' : 'text-title'
              }`}
              onClick={() => handleLike()}
            >
              <ThumbUp size={14} />
              {likes}{' '}
              {!likeState ? (
                <p>ถูกใจ</p>
              ) : (
                <p className='text-content'>เลิกถูกใจ</p>
              )}
            </div>
          </Group>
        </Group>
      </AuthCheck>
      <p className='absolute bottom-4 select-none right-6 leading-none font-bold uppercase opacity-[0.03] text-[120px] md:text-[150px] text-right tracking-tighter'>
        REPLY
      </p>
    </div>
  );
}
