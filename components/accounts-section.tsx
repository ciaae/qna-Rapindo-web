'use client'

import { useEffect, useState } from 'react'
import { AddUserModal } from './add-user-modal'
import { Plus, Trash2 } from 'lucide-react'
import { ConfirmationDelete } from './confirmation-delete'

interface User {
    id: number
    name: string
    email: string
    role: 'admin' | 'staff'
    createdAt: string
}

export function AccountsSection() {
    const [users, setUsers] = useState<User[]>([])
    const [showModal, setShowModal] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchUsers = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts`,
            { credentials: 'include' }
        )
        const data = await res.json()
        // setUsers(data)
        setUsers(Array.isArray(data) ? data : data.data ?? [])
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDeleteClick = (user: User) => {
        setDeleteTarget(user)
        setShowDeleteDialog(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return

        setDeleting(true)
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/accounts/${deleteTarget.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            )
            setUsers(users.filter(u => u.id !== deleteTarget.id))
            setShowDeleteDialog(false)
            setDeleteTarget(null)
        } catch (error) {
            console.error('Error deleting account:', error)
        } finally {
            setDeleting(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteDialog(false)
        setDeleteTarget(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Accounts</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                    <Plus size={20} />
                    Tambah User
                </button>
            </div>

            <div className="bg-white rounded-lg border shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b">
                                <td className="p-4">{u.name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4 capitalize">{u.role}</td>
                                <td className="p-4">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDeleteClick(u)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete user"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AddUserModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        fetchUsers()
                        setShowModal(false)
                    }}
                />
            )}

            <ConfirmationDelete
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={deleting}
                title="Delete Account"
                description="Are you sure you want to delete this account?"
                previewText={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email})` : undefined}
            />
        </div>
    )
}
