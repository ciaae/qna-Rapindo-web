'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategoryFilter } from '@/components/category-filter'
import { QnACard } from '@/components/qna-card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

interface QnAItem {
  id: number
  question: string
  answer: string
  category: string
  tags: string[]
}

const QNA_DATA: QnAItem[] = [
  {
    id: 1,
    question: 'Kenapa checking Rapindo diletakkan di akhir, Sebelum Pencairan?',
    answer: 'Karena setiap kali dilakukan pengecekan (hit/checking) pada asset registry akan timbul biaya. Apabila pengecekan tersebut dilakukan di awal, namun kredit pada akhirnya tidak jadi dicairkan, maka biaya yang timbul tersebut akan dibebankan kepada siapa? Oleh karena itu, pengecekan Rapindo diletakkan di akhir, sebelum pencairan, sehingga biaya yang timbul hanya akan dikenakan pada kredit yang benar-benar dicairkan.',
    category: 'Checking & Pencairan',
    tags: ['pencairan', 'checking'],
  },
  {
    id: 2,
    question: 'Apa yang harus dilakukan jika terdapat pop up notifikasi bloker?',
    answer: '1. Baca instruksi\n2. Membuat tiket Ariana Khusus Rapindo\n3. Mengirimkan pesan WA ke Admin Rapindo dengan format: nomor rangka dan no Ariana',
    category: 'notifikasi bloker',
    tags: ['notifikasi', 'bloker', 'pop up'],
  },
  {
    id: 3,
    question: 'Apakah ada arti code yang ditampilkan pada Pop Up Bloker?',
    answer: 'Iya setiap kode error memiliki artian, contohnya: \n1. Err-01 berarti xxx \n2. Err-02 berarti xxx \n3. Err-03 berarti ada kesalahan penginputan terkait asset registry Kendaraan (terutama similarity dari nomor rangka dengan no polisi) \n4. Err-04 berarti',
    category: 'error code',
    tags: ['error', 'pop up', 'code'],
  },
]

const CATEGORIES = Array.from(new Set(QNA_DATA.map(item => item.category)))
const ALL_TAGS = Array.from(new Set(QNA_DATA.flatMap(item => item.tags)))

export default function Home() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredQnA = QNA_DATA.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight">QNA ASSET REGISTRY RAPINDO</h1>
            <p className="mt-2 text-lg text-muted-foreground">Find answers to your questions</p>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions and answers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="mb-4 font-semibold">Categories</h3>
                  <CategoryFilter
                    categories={CATEGORIES}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>

                {/* Tags */}
                <div>
                  <h3 className="mb-4 font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedTags.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedTags([])
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* QnA List */}
            <div className="lg:col-span-3">
              {filteredQnA.length > 0 ? (
                <div className="space-y-3">
                  {filteredQnA.map(item => (
                    <QnACard
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No results found. Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
