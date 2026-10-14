'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertCircle,
  Search,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AnimatedCheckbox } from '../ui/animated-checkbox';
import { AppSelect } from '../ui/app-select';

interface AdminDashboardProps {
  data: any;
  onRefresh: () => void;
  toast: (msg: string) => void;
}

export function AdminDashboard({ data, onRefresh, toast }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verification' | 'ai' | 'audit'>('overview');
  const [reviewReason, setReviewReason] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [busy, setBusy] = useState(false);

  const stats = data?.stats || {
    totalUsers: 0,
    publishedCreators: 0,
    totalCampaigns: 0,
    totalInvitations: 0,
    activeEngagements: 0,
    pendingVerification: 0,
    supportTickets: 0
  };

  const users = data?.users || [];
  const evidence = data?.evidence || [];
  const auditLogs = data?.audit || [];
  const aiOps = data?.aiOps || {
    totalRequests: 0,
    successfulRequests: 0,
    fallbackActivations: 0,
    averageLatencyMs: 0,
    lastProviderUsed: 'none'
  };

  // Filter users by search and role
  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      !userSearch ||
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleReviewEvidence = async (evidenceId: string, status: 'under review' | 'verified' | 'rejected') => {
    if (reviewReason.trim().length < 5) {
      toast('Please enter a reviewer reason (minimum 5 characters).');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: evidenceId,
          status,
          reason: reviewReason
        })
      });
      if (!res.ok) {
        const errPayload: any = await res.json().catch(() => ({}));
        throw new Error(errPayload?.error || 'Failed to update verification status');
      }
      toast(`Verification marked as ${status}.`);
      setReviewReason('');
      onRefresh();
    } catch (err: any) {
      toast(err?.message || 'Error updating verification');
    } finally {
      setBusy(false);
    }
  };

  const handleToggleUserSuspension = async (userId: string, currentSuspended: boolean) => {
    const promptMsg = currentSuspended
      ? 'Reason for restoring this account:'
      : 'Reason for suspending this account:';
    const reason = window.prompt(promptMsg, currentSuspended ? 'Account appeal approved' : 'Policy violation');
    if (!reason) return;

    setBusy(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'user-status',
          userId,
          suspended: !currentSuspended,
          reason
        })
      });
      if (!res.ok) {
        const errPayload: any = await res.json().catch(() => ({}));
        throw new Error(errPayload?.error || 'Failed to update user status');
      }
      toast(!currentSuspended ? 'User has been suspended.' : 'User account restored.');
      onRefresh();
    } catch (err: any) {
      toast(err?.message || 'Error updating user status');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-dashboard-root">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <span className="eyebrow">PROTECTED ADMINISTRATIVE GOVERNANCE</span>
          <h1 className="admin-title">Platform Administration</h1>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="button secondary admin-refresh-btn"
          disabled={busy}
        >
          <RefreshCw size={14} className={busy ? 'spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={15} />
          <span>Overview & Metrics</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={15} />
          <span>User Directory ({users.length})</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <Shield size={15} />
          <span>Verification Queue ({stats.pendingVerification})</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={15} />
          <span>AI Provider Operations</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <FileText size={15} />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <div className="stat-grid admin-metrics-grid">
            <article>
              <span>REGISTERED USERS</span>
              <strong>{stats.totalUsers}</strong>
              <Users size={20} className="stat-icon" />
            </article>
            <article>
              <span>PUBLISHED CREATORS</span>
              <strong>{stats.publishedCreators}</strong>
              <Sparkles size={20} className="stat-icon" />
            </article>
            <article>
              <span>ACTIVE CAMPAIGNS</span>
              <strong>{stats.totalCampaigns}</strong>
              <Layers size={20} className="stat-icon" />
            </article>
            <article>
              <span>ACTIVE WORKSPACES</span>
              <strong>{stats.activeEngagements}</strong>
              <FileText size={20} className="stat-icon" />
            </article>
            <article>
              <span>PENDING VERIFICATIONS</span>
              <strong style={{ color: stats.pendingVerification > 0 ? 'var(--accent)' : 'inherit' }}>
                {stats.pendingVerification}
              </strong>
              <Shield size={20} className="stat-icon" />
            </article>
            <article>
              <span>AI ASSISTANT CALLS</span>
              <strong>{aiOps.totalRequests}</strong>
              <Cpu size={20} className="stat-icon" />
            </article>
          </div>

          <div className="admin-overview-columns">
            <div className="panel">
              <div className="panel-heading">
                <h3>Recent System Activity</h3>
                <span>Latest audit events</span>
              </div>
              {auditLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="list-row">
                  <div>
                    <strong>{log.action}</strong>
                    <p>Subject: {log.subject || 'Platform entity'} • Actor: {log.actor?.slice(0, 8)}…</p>
                  </div>
                  <span className="muted">{new Date(log.created).toLocaleDateString()}</span>
                </div>
              ))}
              {auditLogs.length === 0 && <p className="muted">No security audit events recorded yet.</p>}
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h3>Dual AI Engine Status</h3>
                <span>OpenAI + Gemini Failover</span>
              </div>
              <div className="ai-status-summary">
                <div className="ai-status-row">
                  <span>Primary Provider</span>
                  <strong>OpenAI (gpt-4o-mini)</strong>
                </div>
                <div className="ai-status-row">
                  <span>Fallback Provider</span>
                  <strong>Google Gemini (1.5-flash)</strong>
                </div>
                <div className="ai-status-row">
                  <span>Failover Activations</span>
                  <strong>{aiOps.fallbackActivations}</strong>
                </div>
                <div className="ai-status-row">
                  <span>Average Latency</span>
                  <strong>{aiOps.averageLatencyMs} ms</strong>
                </div>
                <div className="ai-status-row">
                  <span>Last Operational Model</span>
                  <span className="badge">{aiOps.lastProviderUsed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="admin-tab-content">
          <div className="admin-filter-bar">
            <div className="search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users by name, email or Firebase UID..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                aria-label="Filter users"
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <AppSelect
                ariaLabel="Role filter"
                value={roleFilter}
                onChange={v => setRoleFilter(v)}
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'creator', label: 'Creators' },
                  { value: 'brand', label: 'Brands' },
                  { value: 'agency', label: 'Agencies' },
                  { value: 'admin', label: 'Administrators' }
                ]}
              />
            </div>
          </div>

          <div className="panel admin-table-panel">
            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u: any) => {
                    const isSuspended = !!u.data?.suspended;
                    return (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.name || 'Unnamed User'}</strong>
                          <span className="table-subtext">UID: {u.id?.slice(0, 10)}…</span>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className="badge">{u.role}</span>
                        </td>
                        <td>{new Date(u.created).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-pill ${isSuspended ? 'suspended' : 'active'}`}>
                            {isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className={`button ${isSuspended ? 'secondary' : 'danger-btn'}`}
                            style={{ padding: '6px 12px', fontSize: 11, minHeight: 32 }}
                            onClick={() => handleToggleUserSuspension(u.id, isSuspended)}
                          >
                            {isSuspended ? 'Restore Access' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="empty">
                <h3>No users match your criteria</h3>
                <p>Try clearing your search query or role filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="admin-tab-content">
          <div className="field" style={{ marginBottom: 24 }}>
            <label htmlFor="admin-review-reason">Reviewer Decision Rationale</label>
            <textarea
              id="admin-review-reason"
              placeholder="State the audit finding or evidence verification decision (minimum 5 characters)..."
              value={reviewReason}
              onChange={e => setReviewReason(e.target.value)}
              rows={2}
            />
          </div>

          <div className="verification-cards-list">
            {evidence.map((ev: any) => (
              <section className="panel verification-review-panel" key={ev.id}>
                <div className="panel-heading">
                  <div>
                    <span className={`status-badge ${ev.status.replace(/\s+/g, '-')}`}>
                      {ev.status}
                    </span>
                    <h3 style={{ marginTop: 8 }}>{ev.data?.claim || 'Capability Claim'}</h3>
                  </div>
                  <span className="muted">{new Date(ev.created).toLocaleDateString()}</span>
                </div>

                <p className="preserve">{ev.data?.description}</p>

                {ev.data?.files && ev.data.files.length > 0 && (
                  <div className="file-list" style={{ margin: '18px 0' }}>
                    {ev.data.files.map((fid: string, i: number) => (
                      <a
                        key={fid}
                        href={'/api/files/' + fid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        <Download size={13} />
                        <span>Evidence File {i + 1}</span>
                      </a>
                    ))}
                  </div>
                )}

                {ev.data?.review && (
                  <div className="note" style={{ margin: '14px 0' }}>
                    <strong>Previous Audit Note:</strong> {ev.data.review}
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: 18, paddingTop: 14 }}>
                  <button
                    type="button"
                    className="button secondary"
                    style={{ fontSize: 11, minHeight: 34, padding: '8px 14px' }}
                    disabled={busy || reviewReason.length < 5}
                    onClick={() => handleReviewEvidence(ev.id, 'under review')}
                  >
                    Mark Under Review
                  </button>
                  <button
                    type="button"
                    className="button"
                    style={{ fontSize: 11, minHeight: 34, padding: '8px 14px' }}
                    disabled={busy || reviewReason.length < 5}
                    onClick={() => handleReviewEvidence(ev.id, 'verified')}
                  >
                    Approve Verification
                  </button>
                  <button
                    type="button"
                    className="button secondary danger-text"
                    style={{ fontSize: 11, minHeight: 34, padding: '8px 14px' }}
                    disabled={busy || reviewReason.length < 5}
                    onClick={() => handleReviewEvidence(ev.id, 'rejected')}
                  >
                    Reject Claim
                  </button>
                </div>
              </section>
            ))}

            {evidence.length === 0 && (
              <div className="empty">
                <h3>Verification Queue Clear</h3>
                <p>No creator evidence submissions pending review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AI OPERATIONS */}
      {activeTab === 'ai' && (
        <div className="admin-tab-content">
          <div className="stat-grid">
            <article>
              <span>TOTAL REQUESTS</span>
              <strong>{aiOps.totalRequests}</strong>
            </article>
            <article>
              <span>SUCCESSFUL RESPONSES</span>
              <strong>{aiOps.successfulRequests}</strong>
            </article>
            <article>
              <span>FAILOVER ACTIVATIONS</span>
              <strong>{aiOps.fallbackActivations}</strong>
            </article>
            <article>
              <span>AVG LATENCY</span>
              <strong>{aiOps.averageLatencyMs} ms</strong>
            </article>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h3>Architecture & Circuit Breaker Telemetry</h3>
            <p className="preserve">
              CreaXa implements a zero-downtime dual-provider AI engine. Creative brief requests initially target OpenAI (gpt-4o-mini). In the event of rate-limiting (HTTP 429), provider timeout (&gt;9s), or service unavailability, the circuit breaker automatically routes the exact prompt to Google Gemini (1.5-flash).
            </p>
            <div className="ai-status-summary" style={{ marginTop: 20 }}>
              <div className="ai-status-row">
                <span>Active OpenAI Integration</span>
                <span className="badge">Primary Provider</span>
              </div>
              <div className="ai-status-row">
                <span>Active Google Gemini Integration</span>
                <span className="badge">Secondary Fallback</span>
              </div>
              <div className="ai-status-row">
                <span>Schema Enforcement</span>
                <span>Strict JSON Validation (Zod)</span>
              </div>
              <div className="ai-status-row">
                <span>Last Activity</span>
                <span>{aiOps.lastUpdated || 'No requests this session'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="admin-tab-content">
          <div className="panel admin-table-panel">
            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Actor UID</th>
                    <th>Target Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log: any) => (
                    <tr key={log.id}>
                      <td>{new Date(log.created).toLocaleString()}</td>
                      <td>
                        <strong>{log.action}</strong>
                      </td>
                      <td className="muted">{log.actor}</td>
                      <td className="muted">{log.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {auditLogs.length === 0 && (
              <div className="empty">
                <h3>No Audit Logs Recorded</h3>
                <p>Administrative and security actions will be chronologically logged here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
