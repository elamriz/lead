'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

interface Template {
    id: string;
    name: string;
    subject: string;
    body: string;
    niche: string | null;
    variables: string[];
    isActive: boolean;
    createdAt: string;
}

const DEFAULT_TEMPLATES = [
    {
        name: 'Web Development Offer',
        subject: 'A better website for {company_name}?',
        body: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
  <p>Hi there,</p>

  <p>I came across <strong>{company_name}</strong> in {city} and was impressed by your business. However, I noticed there might be an opportunity to improve your online presence.</p>

  <p>At our agency, we specialize in creating modern, fast, and mobile-friendly websites that help businesses like yours:</p>

  <ul>
    <li>Attract more customers through search engines</li>
    <li>Look professional and trustworthy online</li>
    <li>Convert visitors into paying clients</li>
  </ul>

  <p>Would you be open to a quick chat about how we could help {company_name} grow online?</p>

  <p>Best regards,<br/>Your Name</p>
</div>`,
        niche: '',
    },
    {
        name: 'No Website Detected',
        subject: '{company_name} — your customers are looking for you online',
        body: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
  <p>Hi,</p>

  <p>I was looking for <strong>{company_name}</strong> online and noticed you don't seem to have a website yet.</p>

  <p>Did you know that 97% of consumers search online for local businesses? Without a website, you could be missing out on a significant number of potential customers.</p>

  <p>We help businesses in {city} get online quickly with:</p>

  <ul>
    <li>A professional, custom-designed website</li>
    <li>Mobile-responsive design</li>
    <li>Google Maps and SEO optimization</li>
    <li>Easy-to-manage content</li>
  </ul>

  <p>Would you like to see some examples of what we've built for other {niche} businesses?</p>

  <p>Best,<br/>Your Name</p>
</div>`,
        niche: '',
    },
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [tplNiche, setTplNiche] = useState('');
    const [previewVars, setPreviewVars] = useState<Record<string, string>>({
        company_name: 'Acme Electric',
        city: 'Brussels',
        website: 'www.example.com',
        niche: 'electricians',
        phone: '+32 2 123 4567',
    });
    const [showPreview, setShowPreview] = useState(false);

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            setTemplates(data.templates || []);
        } catch (err) {
            console.error('Failed to load templates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

    const handleCreate = async () => {
        try {
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    subject,
                    body,
                    niche: tplNiche || null,
                }),
            });
            if (res.ok) {
                setShowCreate(false);
                setName('');
                setSubject('');
                setBody('');
                setTplNiche('');
                fetchTemplates();
            }
        } catch (err) {
            console.error('Failed to create:', err);
        }
    };

    const loadPreset = (preset: typeof DEFAULT_TEMPLATES[0]) => {
        setName(preset.name);
        setSubject(preset.subject);
        setBody(preset.body);
        setTplNiche(preset.niche);
        setShowCreate(true);
    };

    const renderPreview = (text: string) => {
        let rendered = text;
        for (const [key, value] of Object.entries(previewVars)) {
            rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
        return rendered;
    };

    return (
        <Sidebar>
            <div className="page-header">
                <div>
                    <h2>Email Templates</h2>
                    <div className="page-subtitle">Create and manage reusable email templates</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
                    + New Template
                </button>
            </div>

            <div className="page-body">
                {loading ? (
                    <div className="loading-overlay">
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-lg animate-in">
                        {/* Quick Start Templates */}
                        {templates.length === 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">🚀 Quick Start</div>
                                </div>
                                <div className="text-sm text-muted mb-lg" style={{ marginBottom: 'var(--space-md)' }}>
                                    Start with one of these pre-built templates:
                                </div>
                                <div className="flex flex-col gap-md">
                                    {DEFAULT_TEMPLATES.map((preset, i) => (
                                        <div key={i} style={{
                                            padding: 'var(--space-md)',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-primary)',
                                        }} onClick={() => loadPreset(preset)}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{preset.name}</div>
                                                <div className="text-sm text-muted">{preset.subject}</div>
                                            </div>
                                            <button className="btn btn-secondary btn-sm">Use Template</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variable Reference */}
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">📌 Available Variables</div>
                            </div>
                            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                {['{company_name}', '{city}', '{website}', '{niche}', '{phone}', '{rating}', '{review_count}', '{first_name}'].map(v => (
                                    <span key={v} className="tag font-mono">{v}</span>
                                ))}
                            </div>
                        </div>

                        {/* Template List */}
                        {templates.length > 0 && (
                            <div className="flex flex-col gap-md">
                                {templates.map(tpl => (
                                    <div key={tpl.id} className="card">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{tpl.name}</h3>
                                                <div className="text-sm text-muted">Subject: {tpl.subject}</div>
                                                <div className="flex gap-sm mt-md" style={{ marginTop: 8 }}>
                                                    {tpl.niche && <span className="tag">{tpl.niche}</span>}
                                                    {tpl.variables.map(v => (
                                                        <span key={v} className="tag font-mono text-xs">{`{${v}}`}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-sm">
                                                <button className="btn btn-ghost btn-sm" onClick={() => {
                                                    setEditId(tpl.id);
                                                    setBody(tpl.body);
                                                    setSubject(tpl.subject);
                                                    setShowPreview(true);
                                                }}>
                                                    👁 Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Create Template Modal */}
                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ fontWeight: 700 }}>Create Template</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="flex flex-col gap-lg">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Template Name</label>
                                            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Niche (optional)</label>
                                            <input className="form-input" value={tplNiche} onChange={e => setTplNiche(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subject Line</label>
                                        <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Body (HTML)</label>
                                        <textarea
                                            className="form-textarea"
                                            value={body}
                                            onChange={e => setBody(e.target.value)}
                                            style={{ minHeight: 250, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreate} disabled={!name || !subject || !body}>
                                    Save Template
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {showPreview && (
                    <div className="modal-overlay" onClick={() => { setShowPreview(false); setEditId(null); }}>
                        <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ fontWeight: 700 }}>Template Preview</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => { setShowPreview(false); setEditId(null); }}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="flex flex-col gap-lg">
                                    <div className="form-group">
                                        <label className="form-label">Preview Variables</label>
                                        <div className="form-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                            {Object.entries(previewVars).map(([key, value]) => (
                                                <input
                                                    key={key}
                                                    className="form-input"
                                                    placeholder={key}
                                                    value={value}
                                                    onChange={e => setPreviewVars(prev => ({ ...prev, [key]: e.target.value }))}
                                                    style={{ fontSize: '0.82rem' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-label" style={{ marginBottom: 8 }}>Subject</div>
                                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                            {renderPreview(subject)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-label" style={{ marginBottom: 8 }}>Body</div>
                                        <div
                                            style={{
                                                padding: 'var(--space-lg)',
                                                background: '#fff',
                                                borderRadius: 'var(--radius-md)',
                                                color: '#333',
                                            }}
                                            dangerouslySetInnerHTML={{ __html: renderPreview(body) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-ghost" onClick={() => { setShowPreview(false); setEditId(null); }}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}
