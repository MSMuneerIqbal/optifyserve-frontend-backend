import { useState, useCallback } from 'react'

interface ModalState<T = unknown> {
  isOpen: boolean
  data: T | null
  mode: 'create' | 'edit' | 'view' | null
}

interface UseModalReturn<T> {
  isOpen: boolean
  data: T | null
  mode: 'create' | 'edit' | 'view' | null
  open: (data?: T, mode?: 'create' | 'edit' | 'view') => void
  close: () => void
  toggle: () => void
  openCreate: () => void
  openEdit: (data: T) => void
  openView: (data: T) => void
}

export function useModal<T = unknown>(initialState: Partial<ModalState<T>> = {}): UseModalReturn<T> {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: null,
    mode: null,
    ...initialState,
  })

  const open = useCallback((data?: T, mode: 'create' | 'edit' | 'view' = 'create') => {
    setState({
      isOpen: true,
      data: data ?? null,
      mode,
    })
  }, [])

  const close = useCallback(() => {
    setState({
      isOpen: false,
      data: null,
      mode: null,
    })
  }, [])

  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }))
  }, [])

  const openCreate = useCallback(() => {
    setState({
      isOpen: true,
      data: null,
      mode: 'create',
    })
  }, [])

  const openEdit = useCallback((data: T) => {
    setState({
      isOpen: true,
      data,
      mode: 'edit',
    })
  }, [])

  const openView = useCallback((data: T) => {
    setState({
      isOpen: true,
      data,
      mode: 'view',
    })
  }, [])

  return {
    isOpen: state.isOpen,
    data: state.data,
    mode: state.mode,
    open,
    close,
    toggle,
    openCreate,
    openEdit,
    openView,
  }
}

// Simple boolean modal hook
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
