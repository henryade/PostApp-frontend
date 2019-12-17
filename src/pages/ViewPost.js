import React, { useContext, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Form } from 'semantic-ui-react';
import moment from 'moment';
import { LikeButton, DeleteButton } from '../components';
import { FETCH_POST_QUERY, POST_COMMENT_MUTATION, CustomPopup } from '../utils';
import { AuthContext } from '../context/auth';

const ViewPost = props => {
  const { postId } = props.match.params;
  const { user } = useContext(AuthContext);
  const [commentBody, setCommentBody] = useState('');
  const commentInputRef = useRef(null);

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [postComment] = useMutation(POST_COMMENT_MUTATION, {
    update() {
      setCommentBody('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: commentBody
    }
  });
  const deletePostCallback = () => props.history.push('/');

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {
      username,
      createdAt,
      body,
      id,
      likeCount,
      likes,
      commentCount,
      comments
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  user={user}
                  post={{
                    id,
                    likeCount,
                    likes
                  }}
                />
                <CustomPopup content="Comment on post">
                  <Button
                    color="blue"
                    icon="comments"
                    label={{ basic: true, content: commentCount, pointing: 'left' }}
                    labelPosition="right"
                    as={'div'}
                    onClick={() => console.log('Comment on Post')}
                  />
                </CustomPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        name="comment"
                        placeholder="Comment..."
                        value={commentBody}
                        onChange={e => setCommentBody(e.target.value)}
                        id="comment"
                        ref={commentInputRef}
                      />
                      <button
                        disabled={commentBody.trim() === ''}
                        className="ui button brown"
                        onClick={postComment}
                        type="submit">
                        Post
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

export default ViewPost;
