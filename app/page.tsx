'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategoryFilter } from '@/components/category-filter'
import { QnACard } from '@/components/qna-card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'

interface QnAItem {
  id: number
  question: string
  answer: string
  category: string
  tags: string[]
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function Home() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [qnaData, setQnaData] = useState<QnAItem[]>([])
  const [loading, setLoading] = useState(true)
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

  const filteredQnA = qnaData.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag => item.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  const CATEGORIES = Array.from(new Set(qnaData.map(item => item.category)))
  const ALL_TAGS = Array.from(new Set(qnaData.flatMap(item => item.tags)))

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
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

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex justify-between items-center mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className='space-y-2'>
              <h1 className="text-4xl font-bold tracking-tight">QNA ASSET REGISTRY RAPINDO</h1>
              <p className="text-lg text-muted-foreground">Find answers to your questions</p>
            </div>
            <Link href="/login">
              <Button variant="outline" className='cursor-pointer'>Admin Login</Button>
            </Link>
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
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors ${selectedTags.includes(tag)
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
              {/* Items Per Page Selector */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleLimitChange}>
                    <SelectTrigger className="w-[70px]">
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

              {loading ? (
                <Loading />
              ) : filteredQnA.length > 0 ? (
                <>
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

                  {/* Pagination */}
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

                    {/* Page Info */}
                    {/* <p className="mt-4 text-center text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} items
                    </p> */}
                  </div>
                </>
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