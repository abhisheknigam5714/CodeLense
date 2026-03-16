import React from 'react';
import { FiGitBranch, FiUser, FiClock, FiGithub } from 'react-icons/fi';

const CommitFeed = ({ commits }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateSha = (sha) => {
    return sha?.substring(0, 7) || '';
  };

  if (!commits || commits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FiGithub />
        </div>
        <h5>No Commits Yet</h5>
        <p>Commits will appear here when team members push to the repository.</p>
      </div>
    );
  }

  return (
    <div className="commit-feed">
      {commits.map((commit) => (
        <div key={commit.id} className="commit-item">
          <div className="commit-sha">
            {truncateSha(commit.commitSha)}
          </div>
          <div className="commit-content">
            <div className="commit-message">
              {commit.commitMessage}
            </div>
            <div className="commit-meta">
              <span className="commit-author d-flex align-items-center gap-1">
                <FiUser /> {commit.githubUsername}
              </span>
              <span className="commit-branch d-flex align-items-center gap-1">
                <FiGitBranch /> {commit.branchName}
              </span>
              <span className="d-flex align-items-center gap-1">
                <FiClock /> {formatDate(commit.committedAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommitFeed;