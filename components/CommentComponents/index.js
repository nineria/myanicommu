import { auth, firestore, getUserWithUsername } from 'lib/firebase';
import React, { useEffect, useState } from 'react';
import Body from './Elements/Body';
import LeftMenu from './Elements/LeftMenu';
import TopMenu from './Elements/TopMenu';
import Layout from './Layout';

export default function Comment(props) {
  const [commentRef, setCommentRef] = useState();
  const [likes, setLikes] = useState();
  const [likeState, setLikeState] = useState(false);
  const [comment] = useState(props.comment);

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
    };

    getLikes();
    getComments();
  }, [props.post, comment]);

  return (
    <div className="bg-foreground rounded-sm">
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
            fetchData={props.fetchData}
          />
        )}
      </Layout>
    </div>
  );
}
