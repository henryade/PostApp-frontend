import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { LIKE_POST_MUTATION, CustomPopup } from '../utils';

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(({ username }) => username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button
        icon="heart"
        onClick={likePost}
        color="brown"
        label={{ content: likeCount }}
        labelPosition="right"
      />
    ) : (
      <Button
        basic
        icon="heart"

        onClick={likePost}
        label={{ basic: true, content: likeCount }}
        labelPosition="right"
      />
    )
  ) : (
    <Button
      basic
      icon="heart"
      onClick={likePost}
      label={{ basic: true, content: likeCount }}
      labelPosition="right"
      as={Link}
      to="/login"
    />
  );

  return <CustomPopup content={liked ? 'Unlike' : 'Like '}>{likeButton}</CustomPopup>;
};

export default LikeButton;
