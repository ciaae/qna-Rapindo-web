import { useState } from 'react'

export function AddUserModal({
  onClose,
  onSuccess
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }
    )

    setLoading(false)

    if (res.ok) {
      onSuccess()
    } else {
      alert('Failed to create user')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Add User</h2>

        <input
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
