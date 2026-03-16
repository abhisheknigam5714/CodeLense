import React from 'react';
import { FiGithub, FiGitCommit, FiCheckCircle, FiClock } from 'react-icons/fi';

const MemberCard = ({ member, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'MANAGER': 'bg-purple-500',
      'TEAM_LEAD': 'bg-blue-500',
      'MEMBER': 'bg-green-500'
    };
    return roleColors[role] || 'bg-gray-500';
  };

  const getLastCommitText = () => {
    if (!member.lastCommitDate) {
      return 'No commits yet';
    }
    const days = member.daysSinceLastCommit;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days === -1) return 'No commits';
    return `${days} days ago`;
  };

  return (
    <div className="member-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="member-header">
        <div className="member-avatar">
          {getInitials(member.name)}
        </div>
        <div className="member-info">
          <h6>{member.name}</h6>
          <p>{member.email}</p>
          {member.githubUsername && (
            <p className="d-flex align-items-center gap-1">
              <FiGithub /> {member.githubUsername}
            </p>
          )}
          <span className={`status-badge status-${member.roleInProject}`}>
            {member.roleInProject?.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="member-stats">
        <div className="stat-item">
          <h4>{member.weeklyCommits || 0}</h4>
          <p>Commits (Week)</p>
        </div>
        <div className="stat-item">
          <h4>{member.totalCommits || 0}</h4>
          <p>Total Commits</p>
        </div>
        <div className="stat-item">
          <h4>{member.completedTasks || 0}/{member.totalTasks || 0}</h4>
          <p>Tasks Done</p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-dark">
        <small className="text-muted d-flex align-items-center gap-1">
          <FiClock /> Last commit: {getLastCommitText()}
        </small>
        {!member.isActive && (
          <span className="text-warning" style={{ fontSize: '0.75rem' }}>
            ⚠ Inactive
          </span>
        )}
      </div>
    </div>
  );
};

export default MemberCard;