import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { AlertTriangle, Trash2, Info } from 'lucide-react'
import { ButtonSpinner } from './loading-spinner'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive' | 'warning'
  isLoading?: boolean
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'bg-blue-100 text-blue-600',
    buttonClass: '',
  },
  destructive: {
    icon: Trash2,
    iconClass: 'bg-red-100 text-red-600',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-amber-100 text-amber-600',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-600',
  },
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  isLoading = false,
}: ConfirmationDialogProps) {
  const { t } = useTranslation()
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                config.iconClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={isLoading}>{cancelLabel || t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(config.buttonClass)}
          >
            {isLoading && <ButtonSpinner className="me-2" />}
            {confirmLabel || t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Delete confirmation dialog
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isLoading = false,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  itemName?: string
  itemType?: string
  isLoading?: boolean
}) {
  const { t } = useTranslation()
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('common.deleteConfirmTitle', { type: itemType })}
      description={
        itemName
          ? t('common.deleteConfirmMessage', { name: itemName })
          : t('common.deleteConfirmGeneric', { type: itemType })
      }
      confirmLabel={t('common.delete')}
      variant="destructive"
      isLoading={isLoading}
    />
  )
}

// Discard changes confirmation dialog
export function DiscardChangesDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const { t } = useTranslation()
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('common.discardChangesTitle')}
      description={t('common.discardChangesMessage')}
      confirmLabel={t('common.discard')}
      variant="warning"
    />
  )
}

export default ConfirmationDialog
