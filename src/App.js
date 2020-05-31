import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React, { Component } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';


class App extends Component {
  render() {
    return (
      <Container className="p-3">
        <Jumbotron>
          <h1 className="header">Yet another Covid-19 Dashboard</h1>
        </Jumbotron>
      </Container>
    );
  }
}

export default App;
