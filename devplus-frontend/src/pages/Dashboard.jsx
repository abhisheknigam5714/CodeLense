import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { 
  FiFolder, 
  FiCheckSquare, 
  FiGitCommit, 
  FiUsers,
  FiPlus,
  FiArrowRight
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsData = await projectService.getAll();
      setProjects(projectsData);

      if (user?.role !== 'MANAGER') {
        const tasksData = await taskService.getMyTasks();
        setTasks(tasksData);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalProjects = projects.length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneTasks = tasks.filter(t => t.status === 'DONE').length;
    
    return { totalProjects, todoTasks, inProgressTasks, doneTasks };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Here's what's happening with your {user?.role === 'MANAGER' ? 'projects' : 'work'} today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {user?.role === 'MANAGER' && (
          <div className="stat-card">
            <div className="stat-icon purple">
              <FiFolder />
            </div>
            <div className="stat-value">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
        )}
        
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{stats.todoTasks}</h3>
            <p>Tasks To Do</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{stats.doneTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      {/* Manager View - Projects List */}
      {user?.role === 'MANAGER' && (
        <div className="card-custom mt-4">
          <div className="card-header-custom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Projects</h5>
            <Link to="/projects">
              <Button className="btn-primary-custom btn-sm-custom">
                <FiPlus className="me-1" /> New Project
              </Button>
            </Link>
          </div>
          <div className="card-body-custom">
            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FiFolder />
                </div>
                <h5>No Projects Yet</h5>
                <p>Create your first project to start tracking team contributions.</p>
                <Link to="/projects">
                  <Button className="btn-primary-custom">
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <Row>
                {projects.slice(0, 3).map((project) => (
                  <Col key={project.id} md={4} className="mb-3">
                    <div className="card-custom h-100">
                      <div className="card-body-custom">
                        <h6 style={{ color: '#e6edf3' }}>{project.name}</h6>
                        <p style={{ 
                          color: '#8b949e', 
                          fontSize: '0.85rem',
                          marginBottom: '12px'
                        }}>
                          {project.description?.substring(0, 100)}
                          {project.description?.length > 100 ? '...' : ''}
                        </p>
                        <Link to={`/projects/${project.id}`}>
                          <Button className="btn-secondary-custom btn-sm-custom">
                            View Details <FiArrowRight className="ms-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      )}

      {/* My Tasks */}
      <div className="card-custom mt-4">
        <div className="card-header-custom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Tasks</h5>
          <Link to="/my-tasks">
            <Button className="btn-secondary-custom btn-sm-custom">
              View All <FiArrowRight className="ms-1" />
            </Button>
          </Link>
        </div>
        <div className="card-body-custom">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiCheckSquare />
              </div>
              <h5>No Tasks Assigned</h5>
              <p>You don't have any tasks assigned yet.</p>
            </div>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="task-card priority-MEDIUM">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 style={{ color: '#e6edf3', marginBottom: '4px' }}>
                      {task.title}
                    </h6>
                    <small style={{ color: '#8b949e' }}>
                      {task.projectName}
                    </small>
                  </div>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;