/**
 * Lost Reason Dialog Component
 * Phase 5: CRM Module - Lead Management
 *
 * Dialog for selecting reason when marking a lead as lost
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, XCircle } from 'lucide-react'
import { LOST_REASONS } from '../types/lead.types'

interface LostReasonDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

export function LostReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LostReasonDialogProps) {
  const { t } = useTranslation()
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [otherReason, setOtherReason] = useState('')

  const handleConfirm = () => {
    const reason = selectedReason === 'Other' ? otherReason : selectedReason
    if (reason) {
      onConfirm(reason)
    }
  }

  const handleClose = () => {
    setSelectedReason('')
    setOtherReason('')
    onClose()
  }

  const isValid = selectedReason && (selectedReason !== 'Other' || otherReason.trim())

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>{t('crm.markLeadAsLost')}</DialogTitle>
              <DialogDescription>
                {t('crm.selectLostReason')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="space-y-2">
              {LOST_REASONS.map((reason) => (
                <div
                  key={reason}
                  className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedReason(reason)}
                >
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="flex-1 cursor-pointer">
                    {t(`crm.lostReason.${reason.toLowerCase().replace(/\s+/g, '')}`)}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {selectedReason === 'Other' && (
            <div className="mt-4">
              <Label htmlFor="otherReason">{t('crm.pleaseSpecify')}</Label>
              <Textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder={t('crm.enterReason')}
                rows={3}
                className="mt-2"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
          >
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t('crm.markAsLost')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LostReasonDialog
