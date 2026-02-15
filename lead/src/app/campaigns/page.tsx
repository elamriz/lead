'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

interface Campaign {
    id: string;
    name: string;
    subject: string;
    niche: string | null;
    status: string;
    dailyLimit: number;
    cooldownDays: number;
    safeSendMode: boolean;
    totalSent: number;
    totalFailed: number;
    totalBounced: number;
    totalReplied: number;
    template: { id: string; name: string } | null;
    _count: { sends: number };
    createdAt: string;
}

interface Template {
    id: string;
    name: string;
    subject: string;
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [sending, setSending] = useState<string | null>(null);
    const [sendResult, setSendResult] = useState<Record<string, unknown> | null>(null);

    // Form
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [niche, setNiche] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [dailyLimit, setDailyLimit] = useState('50');
    const [cooldownDays, setCooldownDays] = useState('30');
    const [safeSend, setSafeSend] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [campRes, tmplRes] = await Promise.all([
                fetch('/api/campaigns'),
                fetch('/api/templates'),
            ]);
            const campData = await campRes.json();
            const tmplData = await tmplRes.json();
            setCampaigns(campData.campaigns || []);
            setTemplates(tmplData.templates || []);
        } catch (err) {
            console.error('Failed to load:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async () => {
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    subject,
                    niche: niche || null,
                    templateId: templateId || null,
                    dailyLimit: parseInt(dailyLimit),
                    cooldownDays: parseInt(cooldownDays),
                    safeSendMode: safeSend,
                }),
            });
            if (res.ok) {
                setShowCreate(false);
                setName('');
                setSubject('');
                setNiche('');
                setTemplateId('');
                fetchData();
            }
        } catch (err) {
            console.error('Failed to create:', err);
        }
    };

    const handleSend = async (campaignId: string) => {
        setSending(campaignId);
        setSendResult(null);
        try {
            const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
            const data = await res.json();
            setSendResult(data);
            fetchData();
        } catch (err) {
            console.error('Send failed:', err);
        } finally {
            setSending(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'badge-new';
            case 'ACTIVE': return 'badge-ready';
            case 'PAUSED': return 'badge-queued';
            case 'COMPLETED': return 'badge-sent';
            case 'CANCELLED': return 'badge-do-not-contact';
            default: return 'badge-new';
        }
    };

    return (
        <Sidebar>
            <div className="page-header">
                <div>
                    <h2>Campaigns</h2>
                    <div className="page-subtitle">Manage and send email campaigns</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
                    + New Campaign
                </button>
            </div>

            <div className="page-body">
                {loading ? (
                    <div className="loading-overlay">
                        <div className="spinner spinner-lg"></div>
                        <span>Loading campaigns...</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-lg animate-in">
                        {/* Send Result */}
                        {sendResult && (
                            <div className="alert alert-info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                                <strong>Send Complete</strong>
                                <div className="text-sm">
                                    ✅ Sent: {(sendResult.results as Record<string, number>)?.sent || 0} |
                                    ⏭ Skipped: {(sendResult.results as Record<string, number>)?.skipped || 0} |
                                    ❌ Failed: {(sendResult.results as Record<string, number>)?.failed || 0}
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={() => setSendResult(null)}>Dismiss</button>
                            </div>
                        )}

                        {/* Campaign List */}
                        {campaigns.length === 0 ? (
                            <div className="card">
                                <div className="empty-state">
                                    <div className="empty-icon">📧</div>
                                    <div>No campaigns yet. Create your first campaign to start outreach.</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-md">
                                {campaigns.map(camp => (
                                    <div key={camp.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center gap-md">
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{camp.name}</h3>
                                                <span className={`badge ${getStatusColor(camp.status)}`}>{camp.status}</span>
                                            </div>
                                            <div className="text-sm text-muted mt-md" style={{ marginTop: 4 }}>
                                                Subject: {camp.subject}
                                            </div>
                                            {camp.template && (
                                                <div className="text-xs text-muted">Template: {camp.template.name}</div>
                                            )}
                                            <div className="flex gap-lg mt-md" style={{ marginTop: 8 }}>
                                                <span className="text-sm">✅ {camp.totalSent} sent</span>
                                                <span className="text-sm">💬 {camp.totalReplied} replied</span>
                                                <span className="text-sm">⚠️ {camp.totalBounced} bounced</span>
                                                <span className="text-sm">❌ {camp.totalFailed} failed</span>
                                            </div>
                                            <div className="flex gap-sm mt-md" style={{ marginTop: 8 }}>
                                                {camp.niche && <span className="tag">{camp.niche}</span>}
                                                {camp.safeSendMode && <span className="tag">🛡 Safe Send</span>}
                                                <span className="tag">Max {camp.dailyLimit}/day</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-sm" style={{ alignItems: 'flex-end' }}>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleSend(camp.id)}
                                                disabled={sending === camp.id || camp.status === 'COMPLETED'}
                                            >
                                                {sending === camp.id ? '⏳ Sending...' : '📤 Send'}
                                            </button>
                                            <div className="text-xs text-muted">
                                                {new Date(camp.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Create Campaign Modal */}
                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ fontWeight: 700 }}>Create Campaign</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="flex flex-col gap-lg">
                                    <div className="form-group">
                                        <label className="form-label">Campaign Name</label>
                                        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Electricians Brussels Q1" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subject Line</label>
                                        <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Better website for {company_name}?" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Template</label>
                                        <select className="form-select" value={templateId} onChange={e => setTemplateId(e.target.value)}>
                                            <option value="">Select template...</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Target Niche (optional)</label>
                                        <input className="form-input" value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g., electricians" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Daily Limit</label>
                                            <input className="form-input" type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Cooldown (days)</label>
                                            <input className="form-input" type="number" value={cooldownDays} onChange={e => setCooldownDays(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-md">
                                        <div
                                            className={`toggle ${safeSend ? 'active' : ''}`}
                                            onClick={() => setSafeSend(!safeSend)}
                                        />
                                        <div>
                                            <div className="text-sm" style={{ fontWeight: 500 }}>Safe Send Mode</div>
                                            <div className="text-xs text-muted">Only send to leads never contacted before</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreate} disabled={!name || !subject}>
                                    Create Campaign
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}
