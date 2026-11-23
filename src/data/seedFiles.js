// Seed data simulating files already in the tracking system
// Covers all 6 departments so each login has something to see immediately.

const mkApprovals = (overrides = {}) => ({
  POA:  { approved: false, approvedBy: null, approvedDate: null },
  POB:  { approved: false, approvedBy: null, approvedDate: null },
  POC:  { approved: false, approvedBy: null, approvedDate: null },
  POS:  { approved: false, approvedBy: null, approvedDate: null },
  DHRM: { approved: false, approvedBy: null, approvedDate: null },
  ...overrides,
})

export const seedFiles = [
  /* ─── IN REGISTRY (5 files — not yet sent) ─── */
  {
    id: 'F001',
    employeeId:   'TSC/048234',
    employeeName: 'James Mwangi Waweru',
    currentDepartment: 'Registry',
    dateUploaded: '2026-11-01',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-01' },
    ],
    approvals: mkApprovals(),
  },
  {
    id: 'F002',
    employeeId:   'TSC/056789',
    employeeName: 'Mary Njeri Kamau',
    currentDepartment: 'Registry',
    dateUploaded: '2026-11-02',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-02' },
    ],
    approvals: mkApprovals(),
  },
  {
    id: 'F003',
    employeeId:   'TSC/023456',
    employeeName: 'Peter Ochieng Otieno',
    currentDepartment: 'Registry',
    dateUploaded: '2026-11-03',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-03' },
    ],
    approvals: mkApprovals(),
  },
  {
    id: 'F004',
    employeeId:   'TSC/078901',
    employeeName: 'Grace Wanjiku Mugo',
    currentDepartment: 'Registry',
    dateUploaded: '2026-11-04',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-04' },
    ],
    approvals: mkApprovals(),
  },
  {
    id: 'F005',
    employeeId:   'TSC/034567',
    employeeName: 'Samuel Kipchoge Ruto',
    currentDepartment: 'Registry',
    dateUploaded: '2026-11-05',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-05' },
    ],
    approvals: mkApprovals(),
  },

  /* ─── AT POA (3 files) ─── */
  {
    id: 'F006',
    employeeId:   'TSC/089012',
    employeeName: 'Alice Akinyi Odhiambo',
    currentDepartment: 'POA',
    dateUploaded: '2026-11-06',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-06' },
      { action: 'File sent to POA',        by: 'Registry Admin', date: '2026-11-07', from: 'Registry', to: 'POA' },
    ],
    approvals: mkApprovals({ POA: { approved: true, approvedBy: 'Agnes Wanjiku', approvedDate: '2026-11-10' } }),
  },
  {
    id: 'F007',
    employeeId:   'TSC/012345',
    employeeName: 'John Kimani Njoroge',
    currentDepartment: 'POA',
    dateUploaded: '2026-11-07',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-07' },
      { action: 'File sent to POA',        by: 'Registry Admin', date: '2026-11-08', from: 'Registry', to: 'POA' },
    ],
    approvals: mkApprovals(),
  },
  {
    id: 'F008',
    employeeId:   'TSC/067890',
    employeeName: 'Fatuma Omar Hassan',
    currentDepartment: 'POA',
    dateUploaded: '2026-11-08',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-08' },
      { action: 'File sent to POA',        by: 'Registry Admin', date: '2026-11-09', from: 'Registry', to: 'POA' },
    ],
    approvals: mkApprovals(),
  },

  /* ─── AT POB (2 files) ─── */
  {
    id: 'F009',
    employeeId:   'TSC/045678',
    employeeName: 'David Muthoni Gitonga',
    currentDepartment: 'POB',
    dateUploaded: '2026-11-05',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-05' },
      { action: 'File sent to POA',        by: 'Registry Admin', date: '2026-11-06', from: 'Registry', to: 'POA' },
      { action: 'File approved at POA',    by: 'Agnes Wanjiku',  date: '2026-11-08' },
      { action: 'File sent to POB',        by: 'Agnes Wanjiku',  date: '2026-11-09', from: 'POA', to: 'POB' },
    ],
    approvals: mkApprovals({
      POA: { approved: true, approvedBy: 'Agnes Wanjiku', approvedDate: '2026-11-08' },
      POB: { approved: true, approvedBy: 'Brian Ochieng', approvedDate: '2026-11-14' },
    }),
  },
  {
    id: 'F010',
    employeeId:   'TSC/090123',
    employeeName: 'Rose Chebet Koech',
    currentDepartment: 'POB',
    dateUploaded: '2026-11-06',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-06' },
      { action: 'File sent to POA',        by: 'Registry Admin', date: '2026-11-07', from: 'Registry', to: 'POA' },
      { action: 'File approved at POA',    by: 'Agnes Wanjiku',  date: '2026-11-09' },
      { action: 'File sent to POB',        by: 'Agnes Wanjiku',  date: '2026-11-10', from: 'POA', to: 'POB' },
    ],
    approvals: mkApprovals({
      POA: { approved: true, approvedBy: 'Agnes Wanjiku', approvedDate: '2026-11-09' },
    }),
  },

  /* ─── AT POC (2 files) ─── */
  {
    id: 'F011',
    employeeId:   'TSC/023789',
    employeeName: 'Patrick Otieno Ouma',
    currentDepartment: 'POC',
    dateUploaded: '2026-11-02',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin',    date: '2026-11-02' },
      { action: 'File sent to POA',        by: 'Registry Admin',    date: '2026-11-03', from: 'Registry', to: 'POA' },
      { action: 'File approved at POA',    by: 'Agnes Wanjiku',     date: '2026-11-05' },
      { action: 'File sent to POB',        by: 'Agnes Wanjiku',     date: '2026-11-06', from: 'POA', to: 'POB' },
      { action: 'File approved at POB',    by: 'Brian Ochieng',     date: '2026-11-08' },
      { action: 'File sent to POC',        by: 'Brian Ochieng',     date: '2026-11-09', from: 'POB', to: 'POC' },
    ],
    approvals: mkApprovals({
      POA: { approved: true, approvedBy: 'Agnes Wanjiku', approvedDate: '2026-11-05' },
      POB: { approved: true, approvedBy: 'Brian Ochieng', approvedDate: '2026-11-08' },
    }),
  },
  {
    id: 'F012',
    employeeId:   'TSC/056234',
    employeeName: 'Esther Wambua Mutua',
    currentDepartment: 'POC',
    dateUploaded: '2026-11-03',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-03' },
      { action: 'File sent to POC',        by: 'Registry Admin', date: '2026-11-04', from: 'Registry', to: 'POC' },
    ],
    approvals: mkApprovals(),
  },

  /* ─── AT POS (2 files) ─── */
  {
    id: 'F013',
    employeeId:   'TSC/034890',
    employeeName: 'Michael Mwenda Murungi',
    currentDepartment: 'POS',
    dateUploaded: '2026-11-01',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin',    date: '2026-11-01' },
      { action: 'File sent to POA',        by: 'Registry Admin',    date: '2026-11-02', from: 'Registry', to: 'POA' },
      { action: 'File approved at POA',    by: 'Agnes Wanjiku',     date: '2026-11-04' },
      { action: 'File sent to POS',        by: 'Agnes Wanjiku',     date: '2026-11-05', from: 'POA', to: 'POS' },
    ],
    approvals: mkApprovals({
      POA: { approved: true, approvedBy: 'Agnes Wanjiku', approvedDate: '2026-11-04' },
      POS: { approved: true, approvedBy: 'Daniel Kipchoge', approvedDate: '2026-11-12' },
    }),
  },
  {
    id: 'F014',
    employeeId:   'TSC/078345',
    employeeName: 'Lucy Waithera Ngugi',
    currentDepartment: 'POS',
    dateUploaded: '2026-11-02',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin', date: '2026-11-02' },
      { action: 'File sent to POS',        by: 'Registry Admin', date: '2026-11-04', from: 'Registry', to: 'POS' },
    ],
    approvals: mkApprovals(),
  },

  /* ─── AT DHRM (1 file) ─── */
  {
    id: 'F015',
    employeeId:   'TSC/012567',
    employeeName: 'Stephen Barasa Wekesa',
    currentDepartment: 'DHRM',
    dateUploaded: '2026-10-20',
    history: [
      { action: 'File uploaded to system', by: 'Registry Admin',    date: '2026-10-20' },
      { action: 'File sent to POA',        by: 'Registry Admin',    date: '2026-10-21', from: 'Registry', to: 'POA' },
      { action: 'File approved at POA',    by: 'Agnes Wanjiku',     date: '2026-10-24' },
      { action: 'File sent to POB',        by: 'Agnes Wanjiku',     date: '2026-10-25', from: 'POA', to: 'POB' },
      { action: 'File approved at POB',    by: 'Brian Ochieng',     date: '2026-10-28' },
      { action: 'File sent to DHRM',       by: 'Brian Ochieng',     date: '2026-10-29', from: 'POB', to: 'DHRM' },
    ],
    approvals: mkApprovals({
      POA:  { approved: true, approvedBy: 'Agnes Wanjiku',    approvedDate: '2026-10-24' },
      POB:  { approved: true, approvedBy: 'Brian Ochieng',    approvedDate: '2026-10-28' },
      DHRM: { approved: true, approvedBy: 'Dr. Elizabeth Kamau', approvedDate: '2026-11-18' },
    }),
  },
]
