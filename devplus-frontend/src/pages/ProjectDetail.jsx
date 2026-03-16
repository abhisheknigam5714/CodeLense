import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import commitService from '../services/commitService';
import TaskCard from '../components/TaskCard';
import MemberCard from '../components/MemberCard';
import CommitFeed from '../components/CommitFeed';
import ContributionChart from '../components/ContributionChart';
import { 
  FiPlus, 
  FiUserPlus, 
  FiTrash2, 
  FiLink,
  FiGitCommit,
  FiUsers,
  FiCheckSquare
} from 'react-icons/fi';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [commits, setCommits] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedToId: null,
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [memberForm, setMemberForm] = useState({
    email: '',
    roleInProject: 'MEMBER'
  });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectData, tasksData, membersData, commitsData, statsData] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        projectService.getMembers(id),
        commitService.getByProject(id),
        commitService.getStats(id)
      ]);

      setProject(projectData);
      setTasks(tasksData);
      setMembers(membersData);
      setCommits(commitsData);
      setMemberStats(statsData);
    } catch (error) {
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const canManageTasks = () => {
    const member = members.find(m => m.userId === user?.id);
    return member?.roleInProject === 'MANAGER' || member?.roleInProject === 'TEAM_LEAD';
  };

  const canManageMembers = () => {
    const member = members.find(m => m.userId === user?.id);
    return member?.roleInProject === 'MANAGER';
  };

  // Task handlers
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await taskService.create(id, taskForm);
      toast.success('Task created successfully!');
      setShowTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        assignedToId: null,
        priority: 'MEDIUM',
        dueDate: ''
      });
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      toast.success('Task status updated!');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted!');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Member handlers
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await projectService.addMember(id, memberForm);
      toast.success('Member added successfully!');
      setShowMemberModal(false);
      setMemberForm({ email: '', roleInProject: 'MEMBER' });
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed!');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const getTaskStats = () => {
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    return { todo, inProgress, done };
  };

  const taskStats = getTaskStats();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state">
        <h5>Project not found</h5>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Project Header */}
      <div className="card-custom mb-4">
        <div className="card-body-custom">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 style={{ color: '#e6edf3' }}>{project.name}</h2>
              <p style={{ color: '#8b949e' }}>{project.description}</p>
              {project.githubRepoUrl && (
                <a 
                  href={project.githubRepoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#7c3aed', fontSize: '0.9rem' }}
                >
                  <FiGitCommit className="me-1" />
                  {project.githubOwner}/{project.githubRepoName}
                </a>
              )}
            </div>
            <div className="d-flex gap-2">
              {canManageMembers() && (
                <Link to={`/projects/${id}/webhook`}>
                  <Button className="btn-secondary-custom btn-sm-custom">
                    <FiLink className="me-1" /> Webhook
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{taskStats.todo}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{taskStats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiCheckSquare />
          </div>
          <div className="stat-value">
            <h3>{taskStats.done}</h3>
            <p>Done</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiUsers />
          </div>
          <div className="stat-value">
            <h3>{members.length}</h3>
            <p>Members</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="nav-tabs-custom mb-4"
      >
        <Tab eventKey="tasks" title={<><FiCheckSquare className="me-1" /> Tasks</>}>
          <div className="card-custom">
            <div className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Project Tasks</h5>
              {canManageTasks() && (
                <Button className="btn-primary-custom btn-sm-custom" onClick={() => setShowTaskModal(true)}>
                  <FiPlus className="me-1" /> Add Task
                </Button>
              )}
            </div>
            <div className="card-body-custom">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FiCheckSquare />
                  </div>
                  <h5>No Tasks Yet</h5>
                  <p>Create tasks to track work progress</p>
                </div>
              ) : (
                <Row>
                  {tasks.map((task) => (
                    <Col key={task.id} md={6} lg={4}>
                      <TaskCard
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={canManageTasks() ? handleDeleteTask : null}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </Tab>

        <Tab eventKey="members" title={<><FiUsers className="me-1" /> Members</>}>
          <div className="card-custom">
            <div className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Team Members</h5>
              {canManageMembers() && (
                <Button className="btn-primary-custom btn-sm-custom" onClick={() => setShowMemberModal(true)}>
                  <FiUserPlus className="me-1" /> Add Member
                </Button>
              )}
            </div>
            <div className="card-body-custom">
              {members.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FiUsers />
                  </div>
                  <h5>No Members Yet</h5>
                  <p>Add team members to this project</p>
                </div>
              ) : (
                <Row>
                  {members.map((member) => (
                    <Col key={member.id} md={6} lg={4}>
                      <MemberCard
                        member={{
                          ...member,
                          name: member.userName,
                          email: member.userEmail,
                          githubUsername: member.userGithubUsername,
                          roleInProject: member.roleInProject
                        }}
                      />
                      {canManageMembers() && member.roleInProject !== 'MANAGER' && (
                        <div className="text-end mb-3">
                          <Button
                            className="btn-danger-custom btn-sm-custom"
                            onClick={() => handleRemoveMember(member.userId)}
                          >
                            <FiTrash2 className="me-1" /> Remove
                          </Button>
                        </div>
                      )}
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </Tab>

        <Tab eventKey="commits" title={<><FiGitCommit className="me-1" /> Commits</>}>
          <div className="card-custom">
            <div className="card-header-custom">
              <h5 className="mb-0">Recent Commits</h5>
            </div>
            <div className="card-body-custom p-0">
              <CommitFeed commits={commits} />
            </div>
          </div>

          <ContributionChart memberStats={memberStats} title="Team Contribution" />
        </Tab>
      </Tabs>

      {/* Create Task Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTaskSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Title *</Form.Label>
              <Form.Control
                type="text"
                className="form-control-custom"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="form-control-custom"
                placeholder="Task description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Assign To</Form.Label>
                  <Form.Select
                    className="form-select-custom"
                    value={taskForm.assignedToId || ''}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.userName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Priority</Form.Label>
                  <Form.Select
                    className="form-select-custom"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Due Date</Form.Label>
              <Form.Control
                type="date"
                className="form-control-custom"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-secondary-custom" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-custom" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Member Modal */}
      <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleMemberSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">User Email *</Form.Label>
              <Form.Control
                type="email"
                className="form-control-custom"
                placeholder="Enter user's email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                required
              />
              <Form.Text style={{ color: '#8b949e' }}>
                The user must already have a DevPlus account
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Role in Project</Form.Label>
              <Form.Select
                className="form-select-custom"
                value={memberForm.roleInProject}
                onChange={(e) => setMemberForm({ ...memberForm, roleInProject: e.target.value })}
              >
                <option value="MEMBER">Member (Developer)</option>
                <option value="TEAM_LEAD">Team Lead</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-secondary-custom" onClick={() => setShowMemberModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-custom" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;