import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Link2, Terminal, HelpCircle, Copy, Check } from 'lucide-react';

export default function N8nModal({ isOpen, onClose, webhookUrl, onSaveWebhook, isN8nActive, onToggleMode }) {
  const [inputUrl, setInputUrl] = useState(webhookUrl || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveWebhook(inputUrl.trim());
    onClose();
  };

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid n8n Webhook URL first.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(inputUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: 'Hello Oyik Bot, this is a test ping from Oyik Clinic Frontend',
          sessionId: 'test_session_' + Date.now(),
          action: 'sendMessage'
        })
      });

      if (response.ok) {
        let responseData = 'OK';
        try {
          const data = await response.json();
          responseData = data.output || data.text || data.message || JSON.stringify(data);
        } catch (e) {
          responseData = await response.text();
        }

        setTestResult({
          success: true,
          message: `Connection successful! (Status: ${response.status}). Response received: "${typeof responseData === 'string' ? responseData.substring(0, 100) : 'Valid JSON'}"`
        });
      } else {
        setTestResult({
          success: false,
          message: `Webhook returned status HTTP ${response.status}. Please make sure your n8n workflow is active or using the test webhook while testing.`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Failed to connect: ${err.message}. If running in browser across domains, make sure CORS is allowed in n8n (or check webhook URL).`
      });
    } finally {
      setTesting(false);
    }
  };

  const samplePayload = `{
  "chatInput": "I want to book an appointment with Dr. Ananya",
  "sessionId": "oyik_session_1729081234",
  "action": "sendMessage"
}`;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Sparkles size={20} color="#c59d5f" />
            </div>
            <div>
              <h3>Connect Your n8n Chatbot Webhook</h3>
              <p className="modal-subtitle">Paste the webhook URL of the chatbot you built in n8n</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Mode Selector */}
          <div className="config-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${isN8nActive ? 'active' : ''}`}
              onClick={() => onToggleMode(true)}
            >
              <span className="mode-dot"></span>
              <strong>Live n8n Webhook</strong>
              <span>Forward messages directly to your n8n AI workflow</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${!isN8nActive ? 'active' : ''}`}
              onClick={() => onToggleMode(false)}
            >
              <span className="mode-dot"></span>
              <strong>Interactive Demo Mode</strong>
              <span>Test the clinic appointment flow without waiting for n8n</span>
            </button>
          </div>

          {/* Webhook Input Form */}
          <div className="form-group">
            <label htmlFor="n8n-webhook-url" className="form-label">
              <Link2 size={15} />
              <span>n8n Webhook / Chat Trigger URL</span>
            </label>
            <div className="input-with-button">
              <input
                id="n8n-webhook-url"
                type="url"
                className="modal-input"
                placeholder="https://your-n8n-instance.app.n8n.cloud/webhook/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm test-btn"
                onClick={handleTestConnection}
                disabled={testing}
              >
                {testing ? 'Testing...' : 'Test Ping'}
              </button>
            </div>
            <span className="form-hint">
              Copy this from your n8n Webhook Node or Chat Trigger Node (Production or Test URL).
            </span>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className={`alert-box ${testResult.success ? 'alert-success' : 'alert-error'}`}>
              {testResult.success ? (
                <CheckCircle2 size={18} className="text-success" />
              ) : (
                <AlertTriangle size={18} className="text-warning" />
              )}
              <div className="alert-text">{testResult.message}</div>
            </div>
          )}

          {/* n8n Payload Guide */}
          <div className="n8n-guide-box">
            <div className="guide-header">
              <div className="guide-title">
                <Terminal size={15} />
                <span>Payload Sent to n8n Webhook</span>
              </div>
              <button 
                type="button" 
                className="copy-btn" 
                onClick={handleCopyPayload}
              >
                {copiedPayload ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="guide-code">
              <code>{samplePayload}</code>
            </pre>
            <div className="guide-tips">
              <HelpCircle size={14} className="text-gold" />
              <span>
                In n8n, you can return <code>{"{ output: 'Your response' }"}</code> or plain text from your AI Agent node.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-gold btn-sm" onClick={handleSave}>
            Save & Apply Webhook
          </button>
        </div>
      </div>
    </div>
  );
}
