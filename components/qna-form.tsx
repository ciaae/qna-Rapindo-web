import React from "react"
import { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'

interface QnAFormProps {
    initialQuestion?: string
    initialAnswer?: string
    initialCategory?: string
    initialTags?: string[]
    onSubmit: (question: string, answer: string, category: string, tags: string[]) => void
    onClose: () => void
    isEditing?: boolean
    isSubmitting?: boolean
}

export function QnAForm({
    initialQuestion = '',
    initialAnswer = '',
    initialCategory = 'General',
    initialTags = [],
    onSubmit,
    onClose,
    isEditing = false,
    isSubmitting = false,
}: QnAFormProps) {
    const [question, setQuestion] = useState(initialQuestion)
    const [answer, setAnswer] = useState(initialAnswer)
    const [category, setCategory] = useState(initialCategory)
    const [tags, setTags] = useState<string[]>(initialTags)
    const [tagInput, setTagInput] = useState('')
    const [errors, setErrors] = useState<{
        question?: string
        answer?: string
        category?: string
    }>({})

    const PREDEFINED_CATEGORIES = [
        'General',
        'Technical',
        'Policy',
        'Documentation',
        'Support',
        'Other'
    ]

    const validateForm = () => {
        const newErrors: typeof errors = {}
        if (!question.trim()) {
            newErrors.question = 'Pertanyaan tidak boleh kosong'
        }
        if (!answer.trim()) {
            newErrors.answer = 'Jawaban tidak boleh kosong'
        }
        if (!category.trim()) {
            newErrors.category = 'Kategori tidak boleh kosong'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim()
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(question.trim(), answer.trim(), category.trim(), tags)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Edit Q&A' : 'Tambah Q&A Baru'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Question Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Pertanyaan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Masukkan pertanyaan..."
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.question ? 'border-red-500' : 'border-slate-300'
                                }`}
                        />
                        {errors.question && (
                            <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                        )}
                    </div>

                    {/* Answer Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Jawaban <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Masukkan jawaban..."
                            rows={8}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.answer ? 'border-red-500' : 'border-slate-300'
                                }`}
                        />
                        {errors.answer && (
                            <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
                        )}
                    </div>

                    {/* Category Select */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Kategori <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.category ? 'border-red-500' : 'border-slate-300'
                                }`}
                        >
                            {PREDEFINED_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tags (Opsional)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Tambah tag..."
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Tags Display */}
                        {tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-blue-900"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting
                                ? 'Menyimpan...'
                                : isEditing
                                    ? 'Simpan Perubahan'
                                    : 'Tambah Q&A'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}