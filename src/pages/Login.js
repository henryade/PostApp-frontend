import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { useForm, LOGIN_USER } from '../utils';
import { AuthContext } from '../context/auth';

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  
  const { onChange, onSubmit, values } = useForm(loginUser, {
    username: '',
    password: '',
  });

  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].message !== 'Errors' ?  { message : err.graphQLErrors[0].message } : err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUser() {
    addUser();
  };

  const { username, password} = values;

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          type="text"
          placeholder="Username..."
          name="username"
          error={!!errors.username}
          value={username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          type="password"
          placeholder="Password..."
          name="password"
          error={!!errors.password}
          value={password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Log In
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
 