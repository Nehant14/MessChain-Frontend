export type Role = 'admin' | 'student' | 'staff';
export type NetworkKind = 'polygon' | 'hyperledger';

export const palette = {
  background: '#09090b',
  surface: '#18181b',
  elevated: '#1f1f23',
  border: '#27272a',
  borderSoft: 'rgba(39, 39, 42, 0.62)',
  text: '#fafafa',
  muted: '#a1a1aa',
  softMuted: '#71717a',
  emerald: '#10b981',
  indigo: '#4f46e5',
  violet: '#7c3aed',
  amber: '#f59e0b',
  red: '#ef4444',
  warning: '#facc15',
  sky: '#38bdf8',
};

export const roles: { id: Role; label: string; helper: string }[] = [
  { id: 'admin', label: 'Admin', helper: 'Governance + ledgers' },
  { id: 'student', label: 'Student', helper: 'Fast service + voting' },
  { id: 'staff', label: 'Staff', helper: 'Ops + daily execution' },
];

export const networkModes: Record<NetworkKind, { label: string; badge: string; accent: string; subcopy: string }> = {
  polygon: {
    label: 'Polygon Network',
    badge: 'POL',
    accent: palette.emerald,
    subcopy: 'Low-fee EVM settlement',
  },
  hyperledger: {
    label: 'Hyperledger Consortium',
    badge: 'HLC',
    accent: palette.violet,
    subcopy: 'Permissioned enterprise ledger',
  },
};

export const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'create-staff', label: 'Create Staff', icon: 'user-plus' },
  { id: 'complaints', label: 'Complaints', icon: 'message-square' },
  { id: 'feedback-report', label: 'Feedback', icon: 'bar-chart-2' },
  { id: 'rebates', label: 'Rebates', icon: 'credit-card' },
  { id: 'create-poll', label: 'Create Poll', icon: 'sliders' },
  { id: 'beta-settings', label: 'Beta', icon: 'alert-triangle' },
] as const;

export const studentTabs = [
  { id: 'qr-scanner', label: 'Scanner', icon: 'camera' },
  { id: 'file-complaint', label: 'Complaint', icon: 'file-text' },
  { id: 'file-feedback', label: 'Feedback', icon: 'star' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'vote', label: 'Vote', icon: 'check-square' },
] as const;

export const staffTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'tasks', label: 'Tasks', icon: 'clipboard' },
  { id: 'logs', label: 'Logs', icon: 'clock' },
  { id: 'inventory', label: 'Inventory', icon: 'package' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const;

