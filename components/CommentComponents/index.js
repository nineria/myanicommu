import { auth, firestore, getUserWithUsername } from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Body from './Body';
import Layout from './Layout';
import LeftMenu from './LeftMenu';
import TopMenu from './TopMenu';

export default function Comment(props) {
  const [commentRef, setCommentRef] = useState();
  const [likes, setLikes] = useState();
  const [likeState, setLikeState] = useState(false);
  const [comment] = useState(props.comment);
  const [active, setActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getComments = async () => {
      const userDoc = await getUserWithUsername(props.post.username);
      const comments = await userDoc.ref
        .collection('posts')
        .doc(props.post.slug)
        .collection('comments')
        .doc(comment.slug);

      setCommentRef(comments);
    };

    const getLikes = async () => {
      try {
        const userStatistics = firestore
          .collection('users')
          .doc(props.post.uid)
          .collection('posts')
          .doc(props.post.slug)
          .collection('comments')
          .doc(comment.slug)
          .collection('likes');

        const userStatisticsPosts = await (
          await userStatistics.get()
        ).docs.map((data) => data.data());

        const uid = auth.currentUser.uid;

        userStatisticsPosts.map((like) => {
          if (like.uid === uid) {
            setLikeState(true);
            return;
          }
        });

        if (userStatisticsPosts.length === 0) setLikes(0);
        else setLikes(userStatisticsPosts.length);
      } catch (err) {
        console.log('error: ', err);
        return;
      }
    };

    const getActive = () => {
      if (router.asPath.split('#')[1] === props.id) return setActive(true);
    };

    getLikes();
    getComments();
    getActive();
  }, [props.post, comment]);

  return (
    <div
      id={props.id}
      className={`bg-foreground  ${
        active ? 'border-2 border-[#ff3333] rounded-none' : 'rounded-sm'
      } `}
    >
      {active && (
        <div className='bg-[#ff3333] text-white text-center'>
          เนื้อหาที่ถูกรายงาน
        </div>
      )}
      <Layout>
        {props.post && <LeftMenu comment={comment} likes={likes} />}
        {props.post && <TopMenu comment={comment} likes={likes} />}
        {props.post && (
          <Body
            commentP={comment}
            commentRef={commentRef}
            post={props.post}
            likes={likes}
            setLikes={setLikes}
            likeState={likeState}
            setLikeState={setLikeState}
            comments={props.comments}
            setComments={props.setComments}
          />
        )}
      </Layout>
    </div>
  );
}
