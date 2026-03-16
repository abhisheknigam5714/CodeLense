import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { toast } from "react-toastify";
import projectService from "../services/projectService";
import {
  FiCopy,
  FiCheck,
  FiGithub,
  FiLink,
  FiExternalLink,
} from "react-icons/fi";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";

const WebhookSetup = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getById(id);
      setProject(data);
    } catch (error) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const getWebhookUrl = () => {
    const baseUrl = window.location.origin.replace(":3000", ":8080");
    return `${baseUrl}/api/webhook/github/${id}`;
  };

  const handleCopy = async () => {
    const url = getWebhookUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Webhook URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

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

  const webhookUrl = getWebhookUrl();

  return (
    <div>
      <div className="dashboard-header">
        <h2>
          <FiLink className="me-2" />
          Webhook Setup
        </h2>
        <p>Configure GitHub webhooks to track commits for {project.name}</p>
      </div>

      <div className="card-custom mb-4">
        <div className="card-header-custom">
          <h5 className="mb-0">Webhook URL</h5>
        </div>
        <div className="card-body-custom">
          <p style={{ color: "#8b949e" }}>
            Use this URL to configure a webhook in your GitHub repository. When
            commits are pushed, GitHub will send the data to this endpoint.
          </p>

          <div className="webhook-url-box mb-3">
            <code>{webhookUrl}</code>
            <Button
              className={
                copied
                  ? "btn-success-custom btn-sm-custom"
                  : "btn-primary-custom btn-sm-custom"
              }
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <FiCheck className="me-1" /> Copied!
                </>
              ) : (
                <>
                  <FiCopy className="me-1" /> Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="card-custom mb-4">
        <div className="card-header-custom">
          <h5 className="mb-0">
            <FiGithub className="me-2" />
            GitHub Setup Instructions
          </h5>
        </div>
        <div className="card-body-custom">
          <ol style={{ color: "#8b949e", lineHeight: "2" }}>
            <li>
              Go to your GitHub repository settings
              {project.githubRepoUrl && (
                <a
                  href={`${project.githubRepoUrl}/settings/hooks`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7c3aed", marginLeft: "8px" }}
                >
                  <FiExternalLink /> Open Settings
                </a>
              )}
            </li>
            <li>
              Navigate to <strong style={{ color: "#e6edf3" }}>Webhooks</strong>{" "}
              → <strong style={{ color: "#e6edf3" }}>Add webhook</strong>
            </li>
            <li>
              Enter the following details:
              <ul style={{ marginTop: "10px" }}>
                <li>
                  <strong style={{ color: "#e6edf3" }}>Payload URL:</strong>{" "}
                  Paste the webhook URL above
                </li>
                <li>
                  <strong style={{ color: "#e6edf3" }}>Content type:</strong>{" "}
                  Select <code>application/json</code>
                </li>
                <li>
                  <strong style={{ color: "#e6edf3" }}>Secret:</strong> Leave
                  empty (not required)
                </li>
                <li>
                  <strong style={{ color: "#e6edf3" }}>Which events:</strong>{" "}
                  Select "Just the push event"
                </li>
              </ul>
            </li>
            <li>
              Click <strong style={{ color: "#e6edf3" }}>"Add webhook"</strong>
            </li>
          </ol>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <h5 className="mb-0">How It Works</h5>
        </div>
        <div className="card-body-custom">
          <Row>
            <Col md={4} className="mb-3">
              <div className="stat-item">
                <h4 style={{ color: "#7c3aed" }}>1</h4>
                <p>Developer pushes code to GitHub</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stat-item">
                <h4 style={{ color: "#7c3aed" }}>2</h4>
                <p>GitHub sends webhook payload to DevPlus</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stat-item">
                <h4 style={{ color: "#7c3aed" }}>3</h4>
                <p>Commits are matched to team members</p>
              </div>
            </Col>
          </Row>

          <Alert
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#8b949e",
              marginTop: "20px",
            }}
          >
            <strong style={{ color: "#3b82f6" }}>Note:</strong> Team members
            must have their GitHub username set in their profile for commits to
            be matched correctly. Commits from unrecognized GitHub usernames
            will still be saved but won't be linked to a specific user.
          </Alert>
        </div>
      </div>

      <div className="mt-4">
        <Link to={`/projects/${id}`}>
          <Button className="btn-secondary-custom">← Back to Project</Button>
        </Link>
      </div>
    </div>
  );
};

export default WebhookSetup;
