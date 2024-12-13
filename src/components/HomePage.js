import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate();

  const handleCardClick = (dbType) => {
    navigate(`/databases/${dbType}`)
  }

  return (
    <Container className="homepage-container">
      <div className="greeting-text">
        <h1>Hey there! 👋</h1>
        <h5>What do you want to learn today?</h5>
      </div>

      <Row className="g-4 mt-4 justify-content-center">
        <Col xs={10} sm={4} md={4} lg={4} className="d-flex">
          <Card className="clickable-card custom-card h-100 w-100"
          onClick={() => handleCardClick('mysql')}>
            <Card.Body>
              <Card.Title>MySQL</Card.Title>
              <Card.Text className="pt-2">
                A widely used open-source Relational Database
                Management System (RDBMS) that organizes data into tables. Ideal for handling structured data.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={10} sm={4} md={4} lg={4} className="d-flex">
          <Card className="clickable-card custom-card h-100 w-100"
          onClick={() => handleCardClick('mongodb')}>
            <Card.Body>
              <Card.Title>MongoDB</Card.Title>
              <Card.Text className="pt-2">
                A popular NoSQL database known for its flexibility
                and scalability that stores data in JSON-like documents.
                Ideal for handling unstructured data
                structures.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
