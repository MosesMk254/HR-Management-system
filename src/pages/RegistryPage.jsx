import { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import {
  Upload, Search, Send, History, CheckCircle,
  X, FileSpreadsheet, Users, ArrowRight, AlertCircle, Info,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { useFiles } from '@/contexts/FilesContext'
import { NON_REGISTRY_DEPARTMENTS, DEPT_META } from '@/data/constants'

/* ─── Excel parser ─── */
function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        if (rows.length < 2) { reject(new Error('File appears to be empty.')); return }

        // Try to detect column positions from header row
        const headers = rows[0].map(h => String(h).toLowerCase().trim())
        const idKw    = ['employee id', 'emp id', 'staff id', 'tsc', 'payroll no', 'id number', 'id']
        const nameKw  = ['employee name', 'full name', 'staff name', 'name']

        let idCol = -1; for (const kw of idKw)   { idCol   = headers.findIndex(h => h.includes(kw)); if (idCol   !== -1) break }
        let nameCol = -1; for (const kw of nameKw) { nameCol = headers.findIndex(h => h.includes(kw)); if (nameCol !== -1) break }

        if (idCol === -1) idCol = 0
        if (nameCol === -1) nameCol = 1

        const result = rows.slice(1)
          .filter(r => r[idCol] || r[nameCol])
          .map(r => ({
            employeeId:   String(r[idCol]   ?? '').trim(),
            employeeName: String(r[nameCol] ?? '').trim(),
          }))
          .filter(r => r.employeeId && r.employeeName)

        resolve(result)
      } catch (err) { reject(err) }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsArrayBuffer(file)
  })
}

/* ─── Send File Modal ─── */
function SendModal({ file, isOpen, onClose, fromDept, onSend }) {
  const [target, setTarget] = useState('')
  const opts = NON_REGISTRY_DEPARTMENTS

  const handleSend = () => {
    if (!target) return
    onSend(file.id, fromDept, target)
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
                <option key={d} value={d}>{d} — {DEPT_META[d]?.label}</option>
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
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
            <ul className="space-y-4">
              {file.history.map((h, i) => (
                <li key={i} className="pl-8 relative">
                  <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    h.action.includes('approved') ? 'bg-green-500' :
                    h.action.includes('sent')     ? 'bg-blue-500'  : 'bg-indigo-400'
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

/* ─── Status badge helper ─── */
function LocationBadge({ dept }) {
  const meta = DEPT_META[dept]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta?.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta?.dot}`} />
      {dept === 'Registry' ? 'In Registry' : `At ${dept}`}
    </span>
  )
}

/* ─── Main Page ─── */
export default function RegistryPage() {
  const { currentUser } = useAuth()
  const { files, addFiles, sendFile } = useFiles()

  // Upload state
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [parsedRows, setParsedRows] = useState(null)   // { data: [], filename: '' }
  const [parseError, setParseError] = useState('')
  const [uploadResult, setUploadResult] = useState(null) // { added, skipped }

  // Table state
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'registry' | 'sent'

  // Modals
  const [sendModal,    setSendModal]    = useState({ open: false, file: null })
  const [historyModal, setHistoryModal] = useState({ open: false, file: null })

  /* ── Excel handling ── */
  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setParseError('Please upload an Excel file (.xlsx or .xls).')
      return
    }
    setParseError('')
    setParsedRows(null)
    try {
      const rows = await parseExcelFile(file)
      if (rows.length === 0) { setParseError('No valid rows found. Ensure columns: Employee ID, Full Name.'); return }
      setParsedRows({ data: rows, filename: file.name })
    } catch (err) {
      setParseError(err.message || 'Failed to parse file.')
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const confirmUpload = () => {
    if (!parsedRows) return
    const result = addFiles(parsedRows.data, currentUser.name)
    setUploadResult(result)
    setParsedRows(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* ── Filtered files table ── */
  const allRegistryFiles = files // registry sees ALL files (tracking)

  const displayed = allRegistryFiles.filter(f => {
    const q = search.toLowerCase()
    const matchSearch = f.employeeId.toLowerCase().includes(q) || f.employeeName.toLowerCase().includes(q)
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'registry' ? f.currentDepartment === 'Registry' :
                              f.currentDepartment !== 'Registry'
    return matchSearch && matchFilter
  })

  const countAt     = (d) => files.filter(f => f.currentDepartment === d).length
  const totalSent   = files.filter(f => f.currentDepartment !== 'Registry').length
  const totalRegistry = countAt('Registry')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registry — File Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload employee spreadsheets, search and dispatch files to departments</p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Files',    value: files.length,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'In Registry',    value: totalRegistry,    color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Sent Out',       value: totalSent,        color: 'text-amber-600',  bg: 'bg-amber-50' },
            { label: 'Departments',    value: 5,                color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Upload section ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-gray-800">Upload Employee Spreadsheet</h2>
          </div>

          {!parsedRows ? (
            <>
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                  isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">
                  Drop your Excel file here or{' '}
                  <span className="text-indigo-600 underline">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">Accepts <strong>.xlsx</strong> / <strong>.xls</strong> · Required columns: <strong>Employee ID</strong>, <strong>Full Name</strong></p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              {parseError && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                  <AlertCircle size={15} /> {parseError}
                </div>
              )}

              {uploadResult && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl">
                  <CheckCircle size={15} />
                  <span>Upload complete — <strong>{uploadResult.added}</strong> file(s) added
                    {uploadResult.skipped > 0 && `, ${uploadResult.skipped} skipped (duplicates)`}.
                  </span>
                  <button onClick={() => setUploadResult(null)} className="ml-auto text-green-500 hover:text-green-700">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="mt-3 flex items-start gap-2 text-xs text-gray-400">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>Duplicate Employee IDs already in the system will be skipped automatically.</span>
              </div>
            </>
          ) : (
            /* Preview table */
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {parsedRows.data.length} employee{parsedRows.data.length !== 1 ? 's' : ''} found
                    <span className="text-gray-400 font-normal ml-2">from "{parsedRows.filename}"</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setParsedRows(null)} icon={X}>Discard</Button>
                  <Button size="sm" onClick={confirmUpload} icon={CheckCircle}>Confirm Upload</Button>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3 pr-4">#</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3 pr-4">Employee ID</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3">Full Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {parsedRows.data.map((r, i) => (
                      <tr key={i}>
                        <td className="p-3 pr-4 text-gray-400 text-xs">{i + 1}</td>
                        <td className="p-3 pr-4 font-mono text-xs text-gray-700">{r.employeeId}</td>
                        <td className="p-3 text-gray-800 font-medium">{r.employeeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Files table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-500" />
              <h2 className="font-semibold text-gray-800">All Employee Files</h2>
              <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">{files.length}</span>
            </div>

            {/* Search */}
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

          {/* Filter tabs */}
          <div className="flex gap-1 mb-4">
            {[
              { key: 'all',      label: `All (${files.length})` },
              { key: 'registry', label: `In Registry (${totalRegistry})` },
              { key: 'sent',     label: `Sent Out (${totalSent})` },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === t.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-4">Employee ID</th>
                  <th className="pb-3 pr-4">Full Name</th>
                  <th className="pb-3 pr-4">Date Uploaded</th>
                  <th className="pb-3 pr-4">Current Location</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map(f => {
                  const atRegistry = f.currentDepartment === 'Registry'
                  return (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-gray-700 font-semibold">{f.employeeId}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{f.employeeName}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{f.dateUploaded}</td>
                      <td className="py-3 pr-4">
                        <LocationBadge dept={f.currentDepartment} />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {atRegistry ? (
                            <Button
                              size="sm"
                              icon={Send}
                              onClick={() => setSendModal({ open: true, file: f })}
                            >
                              Send File
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={History}
                              onClick={() => setHistoryModal({ open: true, file: f })}
                            >
                              Track File
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-14 text-center text-gray-400 text-sm">
                      {search ? `No files matching "${search}".` : 'No files found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modals */}
      <SendModal
        file={sendModal.file}
        isOpen={sendModal.open}
        onClose={() => setSendModal({ open: false, file: null })}
        fromDept="Registry"
        onSend={(id, from, to) => sendFile(id, from, to, currentUser.name)}
      />
      <HistoryModal
        file={historyModal.file}
        isOpen={historyModal.open}
        onClose={() => setHistoryModal({ open: false, file: null })}
      />
    </div>
  )
}
