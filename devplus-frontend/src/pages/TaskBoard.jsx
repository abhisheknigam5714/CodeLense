import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Modal, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import TaskCard from '../components/TaskCard';
import { FiPlus, FiFilter } from 'react-icons/fi';

const TaskBoard = ({ myTasks = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    priority: 'ALL',
    assignee: 'ALL'
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedToId: null,
    priority: 'MEDIUM',
    dueDate: '',
    status: 'TODO'
  });

  const isMyTasks = location.pathname === '/my-tasks';

  useEffect(() => {
    fetchData();
  }, [id, isMyTasks]);

  const fetchData = async () => {
    try {
      let tasksData;
      
      if (isMyTasks) {
        tasksData = await taskService.getMyTasks();
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
      } else {
        tasksData = await taskService.getByProject(id);
        const membersData = await projectService.getMembers(id);
        setMembers(membersData);
      }
      
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const canManageTasks = () => {
    if (isMyTasks) return false;
    const member = members.find(m => m.userId === user?.id);
    return member?.roleInProject === 'MANAGER' || member?.roleInProject === 'TEAM_LEAD';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskForm);
        toast.success('Task updated successfully!');
      } else {
        await taskService.create(id, taskForm);
        toast.success('Task created successfully!');
      }
      
      setShowModal(false);
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        assignedToId: null,
        priority: 'MEDIUM',
        dueDate: '',
        status: 'TODO'
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      toast.success('Task status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assignedToId: task.assignedToId,
      priority: task.priority,
      dueDate: task.dueDate || '',
      status: task.status
    });
    setShowModal(true);
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      if (filter.priority !== 'ALL' && task.priority !== filter.priority) {
        return false;
      }
      if (filter.assignee === 'ME' && task.assignedToId !== user?.id) {
        return false;
      }
      if (filter.assignee !== 'ALL' && filter.assignee !== 'ME' && task.assignedToId !== Number(filter.assignee)) {
        return false;
      }
      return true;
    });
  };

  const getTasksByStatus = (status) => {
    return getFilteredTasks().filter(task => task.status === status);
  };

  const filteredTasks = getFilteredTasks();

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
          <h2>{isMyTasks ? 'My Tasks' : 'Task Board'}</h2>
          <p>{isMyTasks ? 'Your assigned tasks across all projects' : 'Kanban-style task management'}</p>
        </div>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle className="btn-secondary-custom">
              <FiFilter className="me-1" /> Filter
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ background: '#1c2128' }}>
              <Dropdown.Header style={{ color: '#8b949e' }}>Priority</Dropdown.Header>
              <Dropdown.Item 
                style={{ color: filter.priority === 'ALL' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, priority: 'ALL' })}
              >
                All Priorities
              </Dropdown.Item>
              <Dropdown.Item 
                style={{ color: filter.priority === 'HIGH' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, priority: 'HIGH' })}
              >
                High
              </Dropdown.Item>
              <Dropdown.Item 
                style={{ color: filter.priority === 'MEDIUM' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, priority: 'MEDIUM' })}
              >
                Medium
              </Dropdown.Item>
              <Dropdown.Item 
                style={{ color: filter.priority === 'LOW' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, priority: 'LOW' })}
              >
                Low
              </Dropdown.Item>
              
              <Dropdown.Divider style={{ borderColor: '#30363d' }} />
              
              <Dropdown.Header style={{ color: '#8b949e' }}>Assignee</Dropdown.Header>
              <Dropdown.Item 
                style={{ color: filter.assignee === 'ALL' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, assignee: 'ALL' })}
              >
                Everyone
              </Dropdown.Item>
              <Dropdown.Item 
                style={{ color: filter.assignee === 'ME' ? '#7c3aed' : '#e6edf3' }}
                onClick={() => setFilter({ ...filter, assignee: 'ME' })}
              >
                My Tasks
              </Dropdown.Item>
              {members.map((member) => (
                <Dropdown.Item 
                  key={member.userId}
                  style={{ color: filter.assignee === String(member.userId) ? '#7c3aed' : '#e6edf3' }}
                  onClick={() => setFilter({ ...filter, assignee: String(member.userId) })}
                >
                  {member.userName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          
          {!isMyTasks && canManageTasks() && (
            <Button className="btn-primary-custom" onClick={() => setShowModal(true)}>
              <FiPlus className="me-1" /> Add Task
            </Button>
          )}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card-custom">
          <div className="card-body-custom">
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiPlus />
              </div>
              <h5>No Tasks Found</h5>
              <p>
                {isMyTasks 
                  ? "You don't have any tasks assigned yet." 
                  : filter.priority !== 'ALL' || filter.assignee !== 'ALL'
                    ? "No tasks match your filters."
                    : "Create your first task to get started."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {/* TODO Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h6>📋 To Do</h6>
              <span className="task-count">{getTasksByStatus('TODO').length}</span>
            </div>
            {getTasksByStatus('TODO').map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={canManageTasks() ? handleEdit : null}
                onDelete={canManageTasks() ? handleDelete : null}
              />
            ))}
          </div>

          {/* IN PROGRESS Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h6>🔄 In Progress</h6>
              <span className="task-count">{getTasksByStatus('IN_PROGRESS').length}</span>
            </div>
            {getTasksByStatus('IN_PROGRESS').map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={canManageTasks() ? handleEdit : null}
                onDelete={canManageTasks() ? handleDelete : null}
              />
            ))}
          </div>

          {/* DONE Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h6>✅ Done</h6>
              <span className="task-count">{getTasksByStatus('DONE').length}</span>
            </div>
            {getTasksByStatus('DONE').map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={canManageTasks() ? handleEdit : null}
                onDelete={canManageTasks() ? handleDelete : null}
              />
            ))}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingTask(null);
        setTaskForm({
          title: '',
          description: '',
          assignedToId: null,
          priority: 'MEDIUM',
          dueDate: '',
          status: 'TODO'
        });
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? 'Edit Task' : 'Create Task'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Status</Form.Label>
                  <Form.Select
                    className="form-select-custom"
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-custom"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
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
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskBoard;