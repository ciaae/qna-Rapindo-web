import React, { useState } from "react"
import { Trash2, Plus } from 'lucide-react'
import { ConfirmationDelete } from '@/components/confirmation-delete'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

interface NotesSectionProps {
  notes: Note[]
  onAddNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export function NotesSection({ notes, onAddNote, onDeleteNote }: NotesSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toLocaleString('id-ID'),
      }
      onAddNote(newNote)
      setTitle('')
      setContent('')
      setShowForm(false)
    }
  }

  const handleDeleteClick = (note: Note) => {
    setDeleteTarget(note)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteNote(deleteTarget.id)
      setShowDeleteDialog(false)
      setDeleteTarget(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setDeleteTarget(null)
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Catatan & Draft Q&A</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          <Plus size={20} />
          Catatan Baru
        </button>
      </div>

      {/* Add Note Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul catatan..."
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Isi catatan atau draft Q&A..."
                rows={6}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setTitle('')
                  setContent('')
                }}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Simpan Catatan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-12 text-center">
          <p className="text-slate-600 text-lg">Belum ada catatan</p>
          <p className="text-slate-500 text-sm mt-2">Mulai dengan membuat catatan baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-amber-500"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-slate-900 flex-1">{note.title}</h3>
                <button
                  onClick={() => handleDeleteClick(note)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap mb-3 line-clamp-4">{note.content}</p>
              <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* ConfirmationDelete untuk Notes */}
      <ConfirmationDelete
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Hapus Catatan"
        description="Apakah Anda yakin ingin menghapus catatan ini?"
        previewText={deleteTarget?.title}
      />
    </div>
  )
}