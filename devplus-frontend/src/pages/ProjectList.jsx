import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import { FiPlus, FiFolder, FiTrash2, FiArrowRight, FiGithub } from 'react-icons/fi';

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubRepoUrl: '',
    githubOwner: '',
    githubRepoName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await projectService.create(formData);
      toast.success('Project created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        githubRepoUrl: '',
        githubOwner: '',
        githubRepoName: ''
      });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.delete(projectId);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Projects</h2>
          <p>Manage your projects and track team contributions</p>
        </div>
        {user?.role === 'MANAGER' && (
          <Button className="btn-primary-custom" onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card-custom">
          <div className="card-body-custom">
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiFolder />
              </div>
              <h5>No Projects Yet</h5>
              <p>
                {user?.role === 'MANAGER'
                  ? 'Create your first project to start tracking team contributions.'
                  : 'You haven\'t been added to any projects yet.'}
              </p>
              {user?.role === 'MANAGER' && (
                <Button className="btn-primary-custom" onClick={() => setShowModal(true)}>
                  <FiPlus className="me-2" /> Create Project
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Row>
          {projects.map((project) => (
            <Col key={project.id} md={6} lg={4} className="mb-4">
              <div className="card-custom h-100">
                <div className="card-header-custom">
                  <h5 className="mb-0">{project.name}</h5>
                </div>
                <div className="card-body-custom">
                  <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                    {project.description || 'No description provided'}
                  </p>
                  
                  {project.githubRepoUrl && (
                    <div className="mb-3" style={{ fontSize: '0.85rem' }}>
                      <a 
                        href={project.githubRepoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#7c3aed' }}
                      >
                        <FiGithub className="me-1" />
                        {project.githubOwner}/{project.githubRepoName}
                      </a>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Link to={`/projects/${project.id}`}>
                      <Button className="btn-primary-custom btn-sm-custom">
                        View <FiArrowRight className="ms-1" />
                      </Button>
                    </Link>
                    
                    {user?.role === 'MANAGER' && project.createdById === user?.id && (
                      <Button
                        className="btn-danger-custom btn-sm-custom"
                        onClick={() => handleDelete(project.id)}
                      >
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Project Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Project Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                className="form-control-custom"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                className="form-control-custom"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">GitHub Repository URL</Form.Label>
              <Form.Control
                type="url"
                name="githubRepoUrl"
                className="form-control-custom"
                placeholder="https://github.com/owner/repo"
                value={formData.githubRepoUrl}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">GitHub Owner</Form.Label>
                  <Form.Control
                    type="text"
                    name="githubOwner"
                    className="form-control-custom"
                    placeholder="e.g., facebook"
                    value={formData.githubOwner}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Repo Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="githubRepoName"
                    className="form-control-custom"
                    placeholder="e.g., react"
                    value={formData.githubRepoName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-secondary-custom" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-custom" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;