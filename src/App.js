import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MenuBar } from './components';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { Home, Login, Register, ViewPost } from './pages';
import { AuthProvider } from './context/auth';
import { AuthRoute } from './utils';

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Container>
            <MenuBar />
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/register" component={Register} />
            <AuthRoute exact path="/login" component={Login} />
            <Route exact path="/posts/:postId" component={ViewPost} />
          </Container>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
