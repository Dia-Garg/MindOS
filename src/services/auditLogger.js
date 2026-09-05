import { INITIAL_AUDIT_LOGS } from '../data/mockData.js';

class AuditLogger {
  constructor() {
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.subscribers = new Set();
  }

  log({ actor, intent, action, policyCheck, status, details, payload = null }) {
    const entry = {
      id: 'aud_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toLocaleTimeString(),
      isoTime: new Date().toISOString(),
      actor,
      intent,
      action,
      policyCheck: policyCheck || 'Passed (Default)',
      status: status || 'SUCCESS', // SUCCESS, APPROVED_BOUNDED, REJECTED_POLICY, ESCALATED_HUMAN, RECOVERED_FAILOVER
      details,
      payload
    };

    this.logs.unshift(entry);
    this.notify();
    return entry;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.logs);
      } catch (err) {
        console.error('AuditLogger subscriber error:', err);
      }
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  exportJson() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const auditLogger = new AuditLogger();
