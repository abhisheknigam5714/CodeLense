import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FiZap } from 'react-icons/fi';

const NavbarComponent = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'MANAGER':
        return 'role-badge';
      case 'TEAM_LEAD':
        return 'role-badge';
      default:
        return 'role-badge';
    }
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/dashboard">
          <FiZap className="logo-icon" />
          DevPlus
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className={getRoleBadgeClass(user?.role)}>
            {user?.role?.replace('_', ' ')}
          </span>
          <span className="user-name">{user?.name}</span>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;