import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const authenticatedOptions = (
  <Fragment>
    <Nav.Link href="#index" style={{ paddingLeft: '30px', paddingRight: '20px' }}>Explore!</Nav.Link>
    <Nav.Link href="#create-post" style={{ paddingRight: '30px' }}>Create Post</Nav.Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#sign-up">Sign Up</Nav.Link>
    <Nav.Link href="#sign-in">Sign In</Nav.Link>
  </Fragment>
)

const Header = ({ user }) => (
  <Navbar bg="primary" variant="dark" expand="md" style={{ fontSize: '20px' }}>
    <Navbar.Brand href="#" style={{ fontSize: '35px' }}>
      Caffeinated
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        { user && <NavDropdown title={user.username} id="basic-nav-dropdown" className="dropdownitem">

          {/* My Post Link in dropdown menu */}
          <NavDropdown.Item className="dropdownitem" href="#index-user">My Creations</NavDropdown.Item>
          <NavDropdown.Divider className="dropdownitem" />

          {/* Change Password Link in dropdown menu */}
          <NavDropdown.Item className="dropdownitem" href="#change-password">Change Password</NavDropdown.Item>
          <NavDropdown.Divider className="dropdownitem" />

          {/* Sign Out Link in dropdown menu */}
          <NavDropdown.Item className="dropdownitem" href="#sign-out">Sign Out</NavDropdown.Item>
        </NavDropdown>}
        { user ? authenticatedOptions : unauthenticatedOptions }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
