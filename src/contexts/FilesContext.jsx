import { createContext, useContext, useRef, useState } from 'react'
import { seedFiles } from '@/data/seedFiles'

const FilesContext = createContext(null)

export function FilesProvider({ children }) {
  const [files, setFiles] = useState(seedFiles)
  const idCounter = useRef(100) // seed files are F001–F015; new ones start at F100+

  const nextId = () => {
    idCounter.current += 1
    return `F${String(idCounter.current).padStart(3, '0')}`
  }

  /**
   * Add new employee files from Excel upload.
   * Skips duplicates by employeeId.
   * @param {Array<{employeeId, employeeName}>} newEmployees
   * @param {string} uploadedBy
   * @returns {{ added: number, skipped: number }}
   */
  const addFiles = (newEmployees, uploadedBy) => {
    const existingIds = new Set(files.map(f => f.employeeId.trim().toLowerCase()))
    const today = new Date().toISOString().split('T')[0]

    const toAdd = []
    let skipped = 0

    for (const emp of newEmployees) {
      if (existingIds.has(emp.employeeId.trim().toLowerCase())) {
        skipped++
        continue
      }
      existingIds.add(emp.employeeId.trim().toLowerCase())
      toAdd.push({
        id: nextId(),
        employeeId:   emp.employeeId.trim(),
        employeeName: emp.employeeName.trim(),
        currentDepartment: 'Registry',
        dateUploaded: today,
        history: [
          { action: 'File uploaded to system', by: uploadedBy, date: today },
        ],
        approvals: {
          POA:  { approved: false, approvedBy: null, approvedDate: null },
          POB:  { approved: false, approvedBy: null, approvedDate: null },
          POC:  { approved: false, approvedBy: null, approvedDate: null },
          POS:  { approved: false, approvedBy: null, approvedDate: null },
          DHRM: { approved: false, approvedBy: null, approvedDate: null },
        },
      })
    }

    if (toAdd.length > 0) {
      setFiles(prev => [...prev, ...toAdd])
    }
    return { added: toAdd.length, skipped }
  }

  /**
   * Approve a file at the current department.
   */
  const approveFile = (fileId, department, approvedBy) => {
    const today = new Date().toISOString().split('T')[0]
    setFiles(prev =>
      prev.map(f => {
        if (f.id !== fileId) return f
        return {
          ...f,
          history: [
            ...f.history,
            { action: `File approved at ${department}`, by: approvedBy, date: today },
          ],
          approvals: {
            ...f.approvals,
            [department]: { approved: true, approvedBy, approvedDate: today },
          },
        }
      })
    )
  }

  /**
   * Send a file from one department to another.
   */
  const sendFile = (fileId, fromDepartment, toDepartment, sentBy) => {
    const today = new Date().toISOString().split('T')[0]
    setFiles(prev =>
      prev.map(f => {
        if (f.id !== fileId) return f
        return {
          ...f,
          currentDepartment: toDepartment,
          history: [
            ...f.history,
            {
              action: `File sent to ${toDepartment}`,
              by: sentBy,
              date: today,
              from: fromDepartment,
              to: toDepartment,
            },
          ],
        }
      })
    )
  }

  /** Files currently at a given department */
  const filesAt = (department) => files.filter(f => f.currentDepartment === department)

  return (
    <FilesContext.Provider value={{ files, addFiles, approveFile, sendFile, filesAt }}>
      {children}
    </FilesContext.Provider>
  )
}

export const useFiles = () => useContext(FilesContext)
