import { ActivityLogItem, ToolId, ToolCategory } from '../types';

const LOGS_STORAGE_KEY = 'web_util_activity_logs';

export function getActivityLogs(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      // Return initial realistic seed logs
      const seedLogs: ActivityLogItem[] = [
        {
          id: 'log-101',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          toolId: 'word-counter',
          toolName: 'Word & Character Counter',
          category: 'Text & Speech',
          action: 'Analyzed document text',
          details: 'Computed 1,248 words, 7,840 characters, reading time ~5.2 mins',
          status: 'success',
          executionTimeMs: 14
        },
        {
          id: 'log-102',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          toolId: 'image-resizer',
          toolName: 'Image Resizer & DPI Optimizer',
          category: 'Image & Media',
          action: 'Batch resized image',
          details: 'Resized 3840x2160 -> 1920x1080 (JPEG, 85% quality)',
          status: 'success',
          executionTimeMs: 120
        },
        {
          id: 'log-103',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          toolId: 'pdf-merge',
          toolName: 'Merge PDF Documents',
          category: 'PDF Tools',
          action: 'Merged 4 PDF pages',
          details: 'Merged quarterly-report.pdf + appendix.pdf into 1 document',
          status: 'success',
          executionTimeMs: 340
        },
        {
          id: 'log-104',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          toolId: 'json-formatter',
          toolName: 'JSON Formatter & Validator',
          category: 'Code & Data',
          action: 'Beautified JSON schema',
          details: 'Parsed 350 lines, formatted with 2 spaces indent',
          status: 'success',
          executionTimeMs: 8
        },
        {
          id: 'log-105',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          toolId: 'crypto-base64',
          toolName: 'Hash, Encode & Base64 Converter',
          category: 'Network & Security',
          action: 'SHA-256 Checksum Computed',
          details: 'Generated hex checksum for payload authentication',
          status: 'success',
          executionTimeMs: 5
        }
      ];
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(seedLogs));
      return seedLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logActivity(item: Omit<ActivityLogItem, 'id' | 'timestamp'>) {
  try {
    const existing = getActivityLogs();
    const newLog: ActivityLogItem = {
      ...item,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...existing].slice(0, 100); // keep last 100 logs
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity across components
    window.dispatchEvent(new CustomEvent('activity_log_added', { detail: newLog }));
  } catch (err) {
    console.error('Failed to save activity log:', err);
  }
}

export function clearActivityLogs() {
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('activity_logs_cleared'));
  } catch (err) {
    console.error('Failed to clear logs:', err);
  }
}
