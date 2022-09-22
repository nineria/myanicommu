import React from 'react';

function Stats({ children }) {
  const posts = React.Children.map(children, (child) =>
    child.type.displayName === 'Posts' ? child : null
  );
  const comments = React.Children.map(children, (child) =>
    child.type.displayName === 'Comments' ? child : null
  );
  const editDate = React.Children.map(children, (child) =>
    child.type.displayName === 'EditDate' ? child : null
  );
  return (
    <div className='flex flex-row gap-4 text-title min-w-[190px] mt-2 sm:mt-0'>
      <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
        <div>{posts}</div>
        <div className='text-xs text-title opacity-50 ml-1 sm:ml-0'>โพสต์</div>
      </div>
      <div className='lg:border-r-[1px] lg:border-[#aaa]' />
      <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
        <div>{comments}</div>
        <div className='text-xs text-title opacity-50 ml-1 sm:ml-0'>
          ข้อความ
        </div>
      </div>
      <div className='flex text-xs sm:text-sm lg:flex-col lg:items-center items-center gap-1 mr-4 sm:mr-0'>
        <span>แก้ไขล่าสุด</span>
        <span className='text-xs text-title opacity-50 ml-1 sm:ml-0 '>
          {editDate}
        </span>
      </div>
    </div>
  );
}

const Posts = ({ children }) => children;
Posts.displayName = 'Posts';
Stats.Posts = Posts;

const Comments = ({ children }) => children;
Comments.displayName = 'Comments';
Stats.Comments = Comments;

const EditDate = ({ children }) => children;
EditDate.displayName = 'EditDate';
Stats.EditDate = EditDate;

export default Stats;
