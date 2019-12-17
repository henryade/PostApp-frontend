import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Popup } from 'semantic-ui-react';
import {
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
  DELETE_COMMENT_MUTATION,
  CustomPopup
} from '../utils';

const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmDelete(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter(post => post.id !== postId) }
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <>
      <CustomPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          color="red"
          icon="trash"
          floated="right"
          as="div"
          onClick={() => setConfirmDelete(true)}
        />
      </CustomPopup>

      <Confirm
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;
