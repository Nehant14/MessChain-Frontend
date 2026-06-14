export const adminKpis = [
  { label: 'Meals served', value: '12.4k', delta: '+8.4%' },
  { label: 'Open complaints', value: '24', delta: '-6 today' },
  { label: 'Rebate queue', value: '₹148k', delta: '3 on-chain' },
  { label: 'Feedback score', value: '4.7/5', delta: 'AI stable' },
];

export const staffDrafts = [
  { label: 'Employee name', placeholder: 'Enter full name' },
  { label: 'Wallet address', placeholder: '0x71C...3A9f' },
  { label: 'Role assignment', placeholder: 'Kitchen, admin, procurement' },
];

export const complaintFeed = [
  {
    id: 'CMP-1041',
    urgency: 'High',
    status: 'Needs review',
    title: 'Protein serving was delayed beyond lunch cutoff.',
    body: 'Rice and dal were served on time, but the protein line opened 27 minutes late and the token queue never recovered.',
    ipfs: 'QmX7eA1p6zT3d9n4V4k2D7VJ9z1fF4Y8Jv9c8K1Hf2N8mD1',
  },
  {
    id: 'CMP-1042',
    urgency: 'Medium',
    status: 'In progress',
    title: 'Water purifier was running low near the north wing.',
    body: 'Need a replacement cartridge and a short service note for the next staff shift.',
    ipfs: 'QmP9R8b4xH7sJ3n6Q2v8Y1dK3n5W4cZ7m5R2tB1mC9xA0pL',
  },
  {
    id: 'CMP-1043',
    urgency: 'Medium',
    status: 'Resolved',
    title: 'Fork set availability at dinner was below baseline.',
    body: 'Inventory correction applied and the replenishment log was synchronized to the middleware queue.',
    ipfs: 'QmR5wG6mN7pV2cH1kT3aZ8yD9rF4jL5qN6uP1xC7tS8vE9bM',
  },
];

export const feedbackBars = [
  { label: 'Taste', value: 92, color: '#10b981' },
  { label: 'Freshness', value: 81, color: '#4f46e5' },
  { label: 'Timing', value: 74, color: '#38bdf8' },
  { label: 'Cleanliness', value: 88, color: '#7c3aed' },
  { label: 'Temperature', value: 69, color: '#f59e0b' },
];

export const sentimentTags = [
  'Positive',
  'Neutral',
  'Critical',
  'Mixed',
  'Actionable',
  'Stable',
  'Escalated',
  'Resolved',
];

export const rebateClaims = [
  {
    id: 'RB-2204',
    student: 'Aarav Mehta',
    amount: '₹320',
    reason: 'Missed dinner window during approved medical leave',
    lock: 'T+02:44:18',
    hash: '0x9a4f8b2c7d1e5f6a0b4c9d2f6e8a7b3c1d4e5f6071829abc',
    status: 'Pending verification',
  },
  {
    id: 'RB-2205',
    student: 'Nidhi Rao',
    amount: '₹180',
    reason: 'Duplicate debit reversal after wallet sync correction',
    lock: 'T+01:22:10',
    hash: '0x2d5c8a9b1f3e7c4d6a8b9c0d1e2f3a4b5c6d7e8f90123456',
    status: 'Awaiting quorum',
  },
  {
    id: 'RB-2206',
    student: 'Karan Singh',
    amount: '₹540',
    reason: 'Rebate for closed mess due to supplier outage',
    lock: 'T+03:10:55',
    hash: '0xaf12c9d8e7b6a5c4d3f2918273645544332211aa99bb88cc',
    status: 'Queued for approval',
  },
];

export const pollSeed = [
  { label: 'Paneer tikka wrap', votes: 38 },
  { label: 'Veg biryani bowl', votes: 42 },
  { label: 'Sambar rice combo', votes: 29 },
];

export const studentLogs = [
  {
    title: 'Check-in recorded',
    details: 'Block timestamp 12:41:22 UTC • IPFS log QmW9a7...c12',
  },
  {
    title: 'Lunch token claimed',
    details: 'Receipt hash 0x87a1b5...9ff2 • Settled via Polygon',
  },
  {
    title: 'Complaint sync stored',
    details: 'Encrypted record anchored to consortium ledger',
  },
];

export const voteChoices = [
  { label: 'Increase protein allotment', votes: 62, tone: 'emerald' },
  { label: 'Add weekend breakfast', votes: 48, tone: 'indigo' },
  { label: 'Extend dinner hours', votes: 34, tone: 'violet' },
];

export const staffTasks = [
  { title: 'Cross-check pantry intake', note: 'Sync receipts before 18:00' },
  { title: 'Confirm wallet approvals', note: 'Queue sealed after quorum' },
  { title: 'Refresh menu inventory', note: 'Push middleware logs' },
];
