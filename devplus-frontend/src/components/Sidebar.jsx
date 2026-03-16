import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiUsers, 
  FiGitCommit,
  FiSettings,
  FiLink
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> }
    ];

    if (user?.role === 'MANAGER') {
      baseLinks.push(
        { path: '/projects', label: 'Projects', icon: <FiFolder /> },
        { path: '/my-tasks', label: 'My Tasks', icon: <FiCheckSquare /> }
      );
    } else if (user?.role === 'TEAM_LEAD') {
      baseLinks.push(
        { path: '/projects', label: 'My Project', icon: <FiFolder /> },
        { path: '/my-tasks', label: 'Team Tasks', icon: <FiUsers /> }
      );
    } else {
      baseLinks.push(
        { path: '/projects', label: 'My Project', icon: <FiFolder /> },
        { path: '/my-tasks', label: 'My Tasks', icon: <FiCheckSquare /> }
      );
    }

    return baseLinks;
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h5>Menu</h5>
      </div>
      <ul className="sidebar-nav">
        {getNavLinks().map((link) => (
          <li key={link.path} className="sidebar-nav-item">
            <NavLink
              to={link.path}
              className={({ isActive }) => 
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
              end={link.path === '/dashboard'}
            >
              {link.icon}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;