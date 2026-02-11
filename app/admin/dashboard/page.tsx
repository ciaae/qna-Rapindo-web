'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { QnACard } from '@/components/qna-card'
import { QnAForm } from '@/components/qna-form'
import { NotesSection } from '@/components/notes-section'
import { ConfirmationDelete } from '@/components/confirmation-delete'
import { Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { AccountsSection } from '@/components/accounts-section'

interface QnAItem {
    id: number
    question: string
    answer: string
    category: string
    tags: string[]
}

interface Note {
    id: string
    title: string
    content: string
    createdAt: string
}

interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface User {
    id: number
    name: string
    email: string
    role: 'ADMIN' | 'STAFF'
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'qna' | 'notes' | 'accounts'>('qna')
    const [qnaData, setQnaData] = useState<QnAItem[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [showForm, setShowForm] = useState(false)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingQnA, setEditingQnA] = useState<QnAItem | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        const fetchQnA = async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/qna?page=${currentPage}&limit=${itemsPerPage}`,
                    { cache: 'no-store' }
                )

                if (!res.ok) throw new Error('Failed to fetch QnA')

                const response = await res.json()
                setQnaData(response.data)
                setPagination(response.pagination)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchQnA()
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                    { credentials: 'include' }
                )

                if (!res.ok) throw new Error('Not authenticated')

                const data = await res.json()
                setUser(data)
            } catch (error) {
                console.error('Error fetching user:', error)
                setUser(null)
            }
        }

        fetchMe()
    }, [])


    const handleAddQnA = async (
        question: string,
        answer: string,
        category: string,
        tags: string[]
    ) => {
        setSubmitting(true)
        try {
            if (editingId) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/qna/${editingId}`,
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question, answer, category, tags })
                    }
                )
            } else {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/qna`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question, answer, category, tags })
                    }
                )
            }

            // Refresh data setelah submit
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/qna?page=${currentPage}&limit=${itemsPerPage}`,
                { cache: 'no-store' }
            )
            const response = await res.json()
            setQnaData(response.data)
            setPagination(response.pagination)

            setShowForm(false)
            setEditingId(null)
            setEditingQnA(null)
        } catch (error) {
            console.error('Error saving Q&A:', error)
        } finally {
            setSubmitting(false)
        }
    }


    const handleEditQnA = (item: QnAItem) => {
        setEditingId(item.id)
        setEditingQnA(item)
        setShowForm(true)
    }


    const handleDeleteClick = (id: number) => {
        setDeleteTarget(id)
        setShowDeleteDialog(true)
    }

    const handleConfirmDelete = async () => {
        if (deleteTarget === null) return

        setDeleting(true)
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/qna/${deleteTarget}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            )

            // Refresh data after delete
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/qna?page=${currentPage}&limit=${itemsPerPage}`,
                { cache: 'no-store' }
            )
            const response = await res.json()
            setQnaData(response.data)
            setPagination(response.pagination)

            setShowDeleteDialog(false)
            setDeleteTarget(null)
        } catch (error) {
            console.error('Error deleting Q&A:', error)
        } finally {
            setDeleting(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteDialog(false)
        setDeleteTarget(null)
    }

    useEffect(() => {
        const fetchNotes = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/notes`,
                { credentials: 'include' }
            )
            const data = await res.json()
            setNotes(data)
        }

        fetchNotes()
    }, [])



    const handleAddNote = async (note: Note) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notes`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            }
        )

        const newNote = await res.json()
        setNotes([newNote, ...notes])
    }


    const handleDeleteNote = async (id: string) => {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }
        )

        setNotes(notes.filter(n => n.id !== id))
    }


    const handleLogout = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
                method: 'POST',
                credentials: 'include'
            }
        )
        setIsLoggedIn(false)
    }


    const handleCloseForm = () => {
        setShowForm(false)
        setEditingId(null)
        setEditingQnA(null)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLimitChange = (value: string) => {
        setItemsPerPage(parseInt(value))
        setCurrentPage(1) // Reset to first page when changing limit
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (pagination.totalPages <= maxVisible) {
            for (let i = 1; i <= pagination.totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('ellipsis')
                pages.push(pagination.totalPages)
            } else if (currentPage >= pagination.totalPages - 2) {
                pages.push(1)
                pages.push('ellipsis')
                for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('ellipsis')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(pagination.totalPages)
            }
        }

        return pages
    }

    const deleteTargetQuestion = qnaData.find(q => q.id === deleteTarget)?.question

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Logout Berhasil</h1>
                    <p className="text-slate-600 mb-6">
                        Terima kasih telah menggunakan Dashboard Q&A. Sampai jumpa lagi!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login" className='flex-1'>
                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">Login</Button>
                        </Link>
                        {/* <Button onClick={() => setIsLoggedIn(true)} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">Login</Button> */}
                        <Link href="/" className='flex-1'>
                            <Button variant="outline" className='w-full cursor-pointer'>Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if ((activeTab === 'accounts' || activeTab === 'notes') && user?.role !== 'ADMIN') {
        return (
            <div className="text-center text-red-600 font-semibold">
                Unauthorized
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                user={user}
            />


            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-8 py-8">
                {activeTab === 'qna' ? (
                    // Q&A Section
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900">Dashboard Q&A</h1>
                                <p className="text-slate-600 mt-2">Kelola pertanyaan dan jawaban Anda</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingId(null)
                                    setEditingQnA(null)
                                    setShowForm(true)
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
                            >
                                <Plus size={24} />
                                Tambah Q&A
                            </button>
                        </div>

                        {/* Stats */}
                        <div className={`grid gap-4 ${user?.role === 'ADMIN' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            <div className={`bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 ${user?.role === 'ADMIN' ? 'text-left' : 'text-center'}`}>
                                <p className="text-blue-600 text-sm font-semibold">Total Q&A</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{pagination.total}</p>
                            </div>
                            {user?.role === 'ADMIN' && (
                                <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                                    <p className="text-amber-600 text-sm font-semibold">Catatan</p>
                                    <p className="text-3xl font-bold text-amber-900 mt-1">{notes.length}</p>
                                </div>
                            )}
                        </div>

                        {/* Q&A Cards */}
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                                <p className="text-slate-600 text-lg">Memuat data Q&A...</p>
                            </div>
                        ) : qnaData.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="mb-4">
                                    <div className="inline-block bg-blue-100 p-4 rounded-full">
                                        <Plus className="text-blue-600" size={32} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                                    Belum ada Q&A
                                </h3>
                                <p className="text-slate-600 mb-6">
                                    Mulai dengan membuat Q&A pertama Anda
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                >
                                    Buat Q&A Baru
                                </button>
                            </div>
                        ) : (
                            <div className="lg:col-span-3">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Show</span>
                                        <Select value={itemsPerPage.toString()} onValueChange={handleLimitChange}>
                                            <SelectTrigger className="w-17.5">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="25">25</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm text-muted-foreground">items per page</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Total: {pagination.total} items
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {qnaData.map((item) => (
                                        <QnACard
                                            key={item.id}
                                            item={item}
                                            isExpanded={expandedId === item.id}
                                            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            onEdit={handleEditQnA}
                                            onDelete={handleDeleteClick}
                                            showActions={true}
                                            isAdmin={user?.role === 'ADMIN'}
                                        />
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>

                                            {getPageNumbers().map((page, index) => (
                                                <PaginationItem key={index}>
                                                    {page === 'ellipsis' ? (
                                                        <PaginationEllipsis />
                                                    ) : (
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(page as number)}
                                                            isActive={currentPage === page}
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'accounts' && user?.role === 'ADMIN' ? (
                    <AccountsSection />
                ) : activeTab === 'notes' && user?.role === 'ADMIN' && (
                    // Notes Section
                    <NotesSection
                        notes={notes}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                    />
                )}
            </main>

            {/* Q&A Form Modal */}
            {showForm && (
                <QnAForm
                    initialQuestion={editingQnA?.question}
                    initialAnswer={editingQnA?.answer}
                    initialCategory={editingQnA?.category}
                    initialTags={editingQnA?.tags}
                    onSubmit={handleAddQnA}
                    onClose={handleCloseForm}
                    isEditing={!!editingId}
                    isSubmitting={submitting}
                />
            )}

            {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Q&A</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>
                                Apakah Anda yakin ingin menghapus Q&A ini?
                                {deleteTargetQuestion && (
                                    <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                                        <p className="text-sm font-medium text-slate-900">
                                            "{deleteTargetQuestion}"
                                        </p>
                                    </div>
                                )}
                                <p className="mt-3 text-sm">
                                    Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete} disabled={deleting}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {deleting ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
            <ConfirmationDelete
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={deleting}
                title="Hapus Q&A"
                description="Apakah Anda yakin ingin menghapus Q&A ini?"
                previewText={deleteTargetQuestion}
            />
        </div>
    )
}
