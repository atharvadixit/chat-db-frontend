import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';  // Custom CSS file

const NavBar = () => {
  return (
    <Navbar variant="light" expand="lg" className="custom-navbar">
      <Container fluid className="d-flex">  {/* Flex utilities */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">ChatDB</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavBar;