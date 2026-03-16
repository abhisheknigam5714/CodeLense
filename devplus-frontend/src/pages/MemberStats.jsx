import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import commitService from '../services/commitService';
import MemberCard from '../components/MemberCard';
import ContributionChart from '../components/ContributionChart';
import { FiBarChart2, FiUsers } from 'react-icons/fi';

const MemberStats = () => {
  const { id } = useParams();
  const [memberStats, setMemberStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const data = await commitService.getStats(id);
      setMemberStats(data);
    } catch (error) {
      toast.error('Failed to load member statistics');
    } finally {
      setLoading(false);
    }
  };

  const getTopContributor = () => {
    if (memberStats.length === 0) return null;
    return [...memberStats]
      .filter(m => m.weeklyCommits > 0)
      .sort((a, b) => b.weeklyCommits - a.weeklyCommits)[0];
  };

  const getInactiveMembers = () => {
    return memberStats.filter(m => !m.isActive);
  };

  const topContributor = getTopContributor();
  const inactiveMembers = getInactiveMembers();

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
        <h2><FiBarChart2 className="me-2" />Team Statistics</h2>
        <p>View contribution metrics and task completion stats for all team members</p>
      </div>

      {/* Top Contributor & Stats Summary */}
      <Row className="mb-4">
        <Col md={6}>
          <div className="card-custom h-100">
            <div className="card-body-custom">
              <h5 style={{ color: '#22c55e' }}>🏆 Top Contributor This Week</h5>
              {topContributor ? (
                <div className="d-flex align-items-center gap-3 mt-3">
                  <div className="member-avatar">
                    {topContributor.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h4 style={{ color: '#e6edf3', marginBottom: '4px' }}>{topContributor.name}</h4>
                    <p style={{ color: '#8b949e', margin: 0 }}>
                      {topContributor.weeklyCommits} commits this week
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#8b949e' }}>No commits this week</p>
              )}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="card-custom h-100">
            <div className="card-body-custom">
              <h5 style={{ color: '#f59e0b' }}>⚠️ Inactive Members</h5>
              {inactiveMembers.length > 0 ? (
                <ul style={{ color: '#8b949e', paddingLeft: '20px', marginTop: '12px' }}>
                  {inactiveMembers.map((member) => (
                    <li key={member.userId}>
                      {member.name} - {member.daysSinceLastCommit === -1 
                        ? 'No commits yet' 
                        : `Last commit ${member.daysSinceLastCommit} days ago`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#8b949e' }}>All members are active this week! 🎉</p>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Contribution Chart */}
      <ContributionChart memberStats={memberStats} title="Weekly Contribution Overview" />

      {/* Member Cards */}
      <div className="card-custom mt-4">
        <div className="card-header-custom">
          <h5 className="mb-0"><FiUsers className="me-2" />Member Details</h5>
        </div>
        <div className="card-body-custom">
          {memberStats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiUsers />
              </div>
              <h5>No Members Yet</h5>
              <p>Add team members to see their statistics</p>
            </div>
          ) : (
            <Row>
              {memberStats.map((member) => (
                <Col key={member.userId} md={6} lg={4}>
                  <MemberCard member={member} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberStats;