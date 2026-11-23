import { useState } from 'react'
import { CheckCircle, Send, History, Search, X, Users, Clock, CheckSquare } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useFiles } from '@/contexts/FilesContext'
import { DEPARTMENTS, DEPT_META } from '@/data/constants'

/* ─── Send File Modal ─── */
function SendModal({ file, isOpen, onClose, currentDept, onSend }) {
  const [target, setTarget] = useState('')

  // Can send to any department EXCEPT own
  const opts = DEPARTMENTS.filter(d => d !== currentDept)

  const handleSend = () => {
    if (!target) return
    onSend(file.id, currentDept, target)
    setTarget('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Employee File">
      {file && (
        <div>
          <div className="bg-indigo-50 rounded-xl p-4 mb-5">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">Employee File</p>
            <p className="font-semibold text-gray-800">{file.employeeName}</p>
            <p className="text-sm text-gray-500 font-mono">{file.employeeId}</p>
          </div>

          {/* Show current approval status */}
          <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm rounded-xl px-4 py-2.5 mb-5">
            <CheckCircle size={15} />
            <span>
              Approved at <strong>{currentDept}</strong> by{' '}
              {file.approvals?.[currentDept]?.approvedBy ?? 'officer'}
            </span>
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              Send to Department
            </label>
            <select
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">— Select Department —</option>
              {opts.map(d => (
                <option key={d} value={d}>{d} {DEPT_META[d] ? `— ${DEPT_META[d].label}` : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button disabled={!target} onClick={handleSend} icon={Send}>Send File</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ─── File History Modal ─── */
function HistoryModal({ file, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File History" size="lg">
      {file && (
        <div>
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <p className="font-semibold text-gray-800">{file.employeeName}</p>
            <p className="text-sm text-gray-500 font-mono">{file.employeeId}</p>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200" />
            <ul className="space-y-4">
              {file.history.map((h, i) => (
                <li key={i} className="pl-8 relative">
                  <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow ${
                    h.action.toLowerCase().includes('approved') ? 'bg-green-500' :
                    h.action.toLowerCase().includes('sent')     ? 'bg-blue-500'  : 'bg-indigo-400'
                  }`} />
                  <p className="text-sm font-medium text-gray-800">{h.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{h.date} · by {h.by}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ─── Approval cell ─── */
function ApprovalCell({ file, dept, onApprove }) {
  const approval = file.approvals?.[dept]
  if (approval?.approved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
        <CheckCircle size={15} className="shrink-0" />
        Approved
        <span className="text-xs text-gray-400 font-normal">{approval.approvedDate}</span>
      </span>
    )
  }
  return (
    <button
      onClick={() => onApprove(file.id)}
      className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
    >
      <CheckSquare size={14} />
      Mark Approved
    </button>
  )
}

/* ─── Main Page ─── */
export default function DepartmentPage() {
  const { currentUser } = useAuth()
  const { filesAt, approveFile, sendFile } = useFiles()

  const dept  = currentUser.department
  const deptMeta = DEPT_META[dept]
  const myFiles  = filesAt(dept)

  const [search, setSearch]           = useState('')
  const [sendModal, setSendModal]     = useState({ open: false, file: null })
  const [histModal, setHistModal]     = useState({ open: false, file: null })

  const filtered = myFiles.filter(f => {
    const q = search.toLowerCase()
    return f.employeeId.toLowerCase().includes(q) || f.employeeName.toLowerCase().includes(q)
  })

  const approvedCount = myFiles.filter(f => f.approvals?.[dept]?.approved).length
  const pendingCount  = myFiles.length - approvedCount

  const handleApprove = (fileId) => {
    approveFile(fileId, dept, currentUser.name)
  }

  const handleSend = (fileId, from, to) => {
    sendFile(fileId, from, to, currentUser.name)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Page title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deptMeta?.color}`}>{dept}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{deptMeta?.label ?? dept}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review, approve and dispatch employee files</p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Files Received',  value: myFiles.length,  color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
            { label: 'Approved',        value: approvedCount,   color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
            { label: 'Pending Approval',value: pendingCount,    color: 'text-amber-600',  bg: 'bg-amber-50', icon: Clock },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5 flex items-center gap-4`}>
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <s.icon size={28} className={`${s.color} opacity-30 ml-auto`} />
            </div>
          ))}
        </div>

        {/* Files table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Files at {dept}</h2>
              <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">{myFiles.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-full sm:w-72">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID or name…"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {myFiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No files at {dept} yet</p>
              <p className="text-sm text-gray-300 mt-1">Files sent here from Registry or other departments will appear in this list.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 pr-4">Employee ID</th>
                    <th className="pb-3 pr-4">Full Name</th>
                    <th className="pb-3 pr-4">Date Received</th>
                    <th className="pb-3 pr-4 min-w-[160px]">Approval</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(f => {
                    const isApproved = f.approvals?.[dept]?.approved
                    // Find when this file arrived at this dept
                    const receivedEntry = [...f.history].reverse().find(
                      h => h.to === dept || (h.action === 'File uploaded to system' && dept === 'Registry')
                    )
                    const receivedDate = receivedEntry?.date ?? f.dateUploaded

                    return (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs text-gray-700 font-semibold">{f.employeeId}</td>
                        <td className="py-4 pr-4 font-medium text-gray-800">{f.employeeName}</td>
                        <td className="py-4 pr-4 text-gray-400 text-xs">{receivedDate}</td>
                        <td className="py-4 pr-4">
                          <ApprovalCell file={f} dept={dept} onApprove={handleApprove} />
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              icon={Send}
                              disabled={!isApproved}
                              title={!isApproved ? 'Approve the file first' : undefined}
                              onClick={() => setSendModal({ open: true, file: f })}
                            >
                              Send File
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={History}
                              onClick={() => setHistModal({ open: true, file: f })}
                            >
                              History
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && search && (
                    <tr>
                      <td colSpan={5} className="py-14 text-center text-gray-400 text-sm">
                        No files matching "{search}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Modals */}
      <SendModal
        file={sendModal.file}
        isOpen={sendModal.open}
        onClose={() => setSendModal({ open: false, file: null })}
        currentDept={dept}
        onSend={handleSend}
      />
      <HistoryModal
        file={histModal.file}
        isOpen={histModal.open}
        onClose={() => setHistModal({ open: false, file: null })}
      />
    </div>
  )
}
