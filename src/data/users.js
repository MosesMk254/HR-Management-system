// Dummy user accounts — one per department
// In a real system these would be in a database with hashed passwords.

export const users = [
  {
    id: 1,
    name:       'Registry Admin',
    username:   'registry',
    password:   'registry123',
    department: 'Registry',
  },
  {
    id: 2,
    name:       'Agnes Wanjiku',
    username:   'poa.officer',
    password:   'poa123',
    department: 'POA',
  },
  {
    id: 3,
    name:       'Brian Ochieng',
    username:   'pob.officer',
    password:   'pob123',
    department: 'POB',
  },
  {
    id: 4,
    name:       'Catherine Muthoni',
    username:   'poc.officer',
    password:   'poc123',
    department: 'POC',
  },
  {
    id: 5,
    name:       'Daniel Kipchoge',
    username:   'pos.officer',
    password:   'pos123',
    department: 'POS',
  },
  {
    id: 6,
    name:       'Dr. Elizabeth Kamau',
    username:   'dhrm.officer',
    password:   'dhrm123',
    department: 'DHRM',
  },
]
