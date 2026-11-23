// Ministry of Education HR — Department Constants

export const DEPARTMENTS = ['Registry', 'POA', 'POB', 'POC', 'POS', 'DHRM']
export const NON_REGISTRY_DEPARTMENTS = ['POA', 'POB', 'POC', 'POS', 'DHRM']

export const DEPT_META = {
  Registry: { label: 'Registry',                     color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
  POA:      { label: 'Personnel Officer A (POA)',     color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  POB:      { label: 'Personnel Officer B (POB)',     color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  POC:      { label: 'Personnel Officer C (POC)',     color: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500' },
  POS:      { label: 'Personnel Officer S (POS)',     color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  DHRM:     { label: 'Director HR Management (DHRM)', color: 'bg-rose-100 text-rose-700',     dot: 'bg-rose-500' },
}
