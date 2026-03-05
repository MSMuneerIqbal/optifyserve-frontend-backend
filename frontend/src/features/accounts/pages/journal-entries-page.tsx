/**
 * Journal Entries Page
 * Phase 9: Accounts/Finance Module
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { JournalEntryList } from '../components/journal-entry-list'
import { JournalEntryForm } from '../components/journal-entry-form'
import type { JournalEntry, JournalEntryFormData } from '../types/journal-entry.types'

export function JournalEntriesPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const isLoading = false

  const handleCreate = useCallback(() => {
    setSelectedEntry(null)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleView = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry)
  }, [])

  const handleEdit = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry)
    setFormMode('edit')
    setIsFormOpen(true)
  }, [])

  const handleFormSubmit = (_data: JournalEntryFormData) => {
    setIsFormOpen(false)
    setSelectedEntry(null)
    toast.success(formMode === 'edit' ? t('accounts.journalUpdated') : t('accounts.journalCreated'))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.journalTitle')}
        description={t('accounts.journalDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('accounts.newEntry')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      <JournalEntryList onView={handleView} onEdit={handleEdit} />

      {/* Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {formMode === 'edit' ? t('accounts.editEntry') : t('accounts.newJournalEntry')}
            </SheetTitle>
          </SheetHeader>
          <JournalEntryForm
            entry={formMode === 'edit' ? selectedEntry ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default JournalEntriesPage
