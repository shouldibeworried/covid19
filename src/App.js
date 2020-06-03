import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';


class App extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Should you be worried about Covid-19?</Navbar.Brand>
        </Navbar>
      <Container>
        <Row>
          <Col md>
            <Card className="mt-4">
              <Card.Body>
              <Card.Title>Current Situation</Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
              </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md>
            <Card className="mt-4">
              <Card.Body>
              <Card.Title>Outlook</Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
                Lorem ipsum dolor sit amet.
              </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
        </div>
    );
  }
}

export default App;
