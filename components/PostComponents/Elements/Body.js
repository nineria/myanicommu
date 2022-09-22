import { Button, Group, Image, Modal, Space, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import AdminCheck from 'hooks/AdminCheck';
import AuthCheck from 'hooks/AuthCheck';
import AuthorCheck from 'hooks/AuthorCheck';
import { UserContext } from 'lib/context';
import { auth, firestore } from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
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
  post,
  postRef,
  likes,
  setLikes,
  likeState,
  setLikeState,
}) {
  const [opened, setOpened] = useState(false);
  const { user } = useContext(UserContext);

  const modals = useModals();
  const router = useRouter();

  const updatedAt =
    typeof post?.updatedAt === 'number'
      ? new Date(post.updatedAt)
      : post.updatedAt?.toDate();

  const date = updatedAt?.toLocaleDateString('th-th', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleLike = async () => {
    const uid = auth.currentUser.uid;

    let exist = false;
    let change = '';

    const userStatistics = firestore
      .collection('users')
      .doc(post.uid)
      .collection('posts')
      .doc(post.slug)
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
      await postRef.delete();

      const userStatistics = firestore.collection('statistics').doc(post.uid);
      const userStatisticsPosts = (await userStatistics.get()).data();
      await userStatistics.update({
        posts: userStatisticsPosts.posts - 1,
      });

      showNotification({
        color: 'red',
        title: 'ลบโพสต์แล้ว',
        icon: <X size={18} />,
        classNames: {
          root: 'bg-foreground border-red-400',
        },
      });
      modals.closeModal(id);

      router.replace('/posts');
    };
    const id = modals.openModal({
      title: (
        <Stack>
          <Text size='sm'>คุณต้องการลบโพสต์นี้หรือไม่?</Text>
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
    <div className='relative p-2 text-title text-opacity-90 w-full'>
      <Group position='apart'>
        {post.createdAt?.seconds !== post.updatedAt?.seconds ? (
          <p className='text-xs opacity-80 mb-2'>แก้ไขล่าสุด : {date}</p>
        ) : (
          <div />
        )}
        <Modal
          size='xl'
          classNames={{
            modal: 'bg-foreground',
            overlay: 'bg-background',
            title: 'text-title',
          }}
          closeOnClickOutside={false}
          opened={opened}
          onClose={() => setOpened(false)}
          title='แก้ไขโพสต์'
        >
          <Edit post={post} postRef={postRef} setOpened={setOpened} />
        </Modal>
        <Group spacing='xs' className='z-20'>
          <AuthorCheck username={post.username}>
            <Button
              onClick={() => setOpened(true)}
              leftIcon={<EditIcon size={14} />}
              compact
              className='bg-foreground text-title hover:bg-content hover:text-[#fff]'
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
                className='bg-red-500 text-[#fff] hover:bg-red-500 hover:opacity-75'
                variant='default'
                size='xs'
              >
                ลบเนื้อหา
              </Button>
            </AdminCheck>
          )}
        </Group>
      </Group>
      <Image src={post.image} alt={post.image} my='xs' radius='sm' />
      <RichTextEditor
        readOnly
        value={post.content}
        classNames={{
          root: 'bg-transparent border-none text-title z-10',
        }}
      />

      <Space h='50px' />
      <p className='absolute select-none bottom-20 right-6 font-bold leading-none uppercase opacity-[0.03] text-[120px] md:text-[150px] text-right tracking-tighter'>
        {post.tag[0]?.label === 'คำถาม'
          ? 'QUESTION'
          : post.tag[0]?.label === 'รีวิว'
          ? 'REVIEW'
          : post.tag[0]?.label === 'สปอย'
          ? 'SPOILER'
          : post.tag[0]?.label === 'ข่าวสาร'
          ? 'NEWS'
          : 'OTHER'}
      </p>
      <span className='text-title text-sm'>
        ที่มา: {post.credit === '<p><br></p>' && 'Original'}
      </span>
      <RichTextEditor
        readOnly
        value={post.credit}
        classNames={{
          root: 'bg-transparent border-none text-title z-10',
        }}
      />
      <AuthCheck fallback={<div />}>
        <Group position='apart' className='text-xs px-2' my='xs'>
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
    </div>
  );
}
