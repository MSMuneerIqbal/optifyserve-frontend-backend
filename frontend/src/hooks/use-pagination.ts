import { useState, useCallback, useMemo } from 'react'
import { DEFAULT_PAGE_SIZE, PAGINATION_SIZES } from '@/lib/constants'

interface UsePaginationProps {
  totalItems: number
  initialPage?: number
  initialPageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
  firstPage: () => void
  lastPage: () => void
  pageSizeOptions: readonly number[]
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: UsePaginationProps): UsePaginationReturn {
  const [page, setPageState] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  )

  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const setPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages))
      setPageState(validPage)
    },
    [totalPages]
  )

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size)
      // Reset to first page when page size changes
      setPageState(1)
    },
    []
  )

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPageState((prev) => prev - 1)
    }
  }, [hasPreviousPage])

  const firstPage = useCallback(() => {
    setPageState(1)
  }, [])

  const lastPage = useCallback(() => {
    setPageState(totalPages)
  }, [totalPages])

  return {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    pageSizeOptions: PAGINATION_SIZES,
  }
}
