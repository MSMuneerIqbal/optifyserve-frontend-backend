import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileUpload } from '@/components/shared/file-upload'
import { toast } from 'sonner'
import type { Attachment } from '@/types/common.types'

interface ItemImportDialogProps {
  isOpen: boolean
  onClose: () => void
}

type ImportStep = 'upload' | 'preview' | 'confirm'

const COLUMN_OPTIONS = [
  'itemCode',
  'itemName',
  'category',
  'unit',
  'unitPrice',
  'reorderLevel',
  'skip',
] as const

const mockPreviewData = [
  { col1: 'AC-FLT-001', col2: 'AC Filter 20x20', col3: 'Filters', col4: 'piece', col5: '45.00', col6: '50' },
  { col1: 'AC-FLT-002', col2: 'AC Filter 24x24', col3: 'Filters', col4: 'piece', col5: '55.00', col6: '30' },
  { col1: 'EL-CBL-001', col2: 'Electrical Cable 2.5mm', col3: 'Electrical', col4: 'meter', col5: '3.50', col6: '500' },
  { col1: 'PL-PIP-001', col2: 'PVC Pipe 1 inch', col3: 'Plumbing', col4: 'meter', col5: '8.00', col6: '200' },
  { col1: 'AC-REF-001', col2: 'Refrigerant R410A', col3: 'HVAC', col4: 'kg', col5: '120.00', col6: '25' },
]

export function ItemImportDialog({ isOpen, onClose }: ItemImportDialogProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<ImportStep>('upload')
  const [files, setFiles] = useState<Attachment[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    col1: 'itemCode',
    col2: 'itemName',
    col3: 'category',
    col4: 'unit',
    col5: 'unitPrice',
    col6: 'reorderLevel',
  })

  const handleClose = () => {
    setStep('upload')
    setFiles([])
    onClose()
  }

  const handleUploadNext = () => {
    if (files.length > 0) {
      setStep('preview')
    }
  }

  const handlePreviewNext = () => {
    setStep('confirm')
  }

  const handleImport = () => {
    toast.success(t('inventory.importSuccess', { count: mockPreviewData.length }))
    handleClose()
  }

  const handleBack = () => {
    if (step === 'preview') setStep('upload')
    if (step === 'confirm') setStep('preview')
  }

  const columnLabels: Record<string, string> = {
    itemCode: t('inventory.itemCode'),
    itemName: t('inventory.itemName'),
    category: t('common.category'),
    unit: t('inventory.unit'),
    unitPrice: t('inventory.unitPrice'),
    reorderLevel: t('inventory.reorderLevel'),
    skip: t('common.skip'),
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('inventory.importItems')}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-4">
          {(['upload', 'preview', 'confirm'] as ImportStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : i < ['upload', 'preview', 'confirm'].indexOf(step)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < ['upload', 'preview', 'confirm'].indexOf(step) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-sm hidden sm:inline">
                {s === 'upload' ? t('inventory.uploadFile') : s === 'preview' ? t('inventory.previewMapping') : t('inventory.confirmImport')}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('inventory.importHint')}
              </AlertDescription>
            </Alert>
            <FileUpload
              value={files}
              onChange={setFiles}
              accept=".xlsx,.xls,.csv"
              maxFiles={1}
              maxSizeMB={5}
            />
          </div>
        )}

        {/* Step 2: Preview & Column Mapping */}
        {step === 'preview' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('inventory.mapColumnsDescription')}
            </p>

            {/* Column Mapping */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(columnMapping).map((col) => (
                <div key={col}>
                  <Label className="text-xs">{t('inventory.column')} {col.replace('col', '')}</Label>
                  <Select
                    value={columnMapping[col]}
                    onValueChange={(val) => setColumnMapping((prev) => ({ ...prev, [col]: val }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMN_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {columnLabels[opt]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Preview Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {Object.entries(columnMapping).map(([col, field]) => (
                      <TableHead key={col} className="text-xs">
                        {columnLabels[field]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPreviewData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{row.col1}</TableCell>
                      <TableCell className="text-sm">{row.col2}</TableCell>
                      <TableCell className="text-sm">{row.col3}</TableCell>
                      <TableCell className="text-sm">{row.col4}</TableCell>
                      <TableCell className="text-sm">{row.col5}</TableCell>
                      <TableCell className="text-sm">{row.col6}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-green-50 p-6 text-center">
              <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">{t('inventory.readyToImport')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('inventory.importSummary', { count: mockPreviewData.length })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">{t('inventory.fileName')}</p>
                <p className="font-medium">{files[0]?.name || '-'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">{t('inventory.totalRows')}</p>
                <p className="font-medium">{mockPreviewData.length}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step !== 'upload' && (
            <Button variant="outline" onClick={handleBack}>
              {t('common.back')}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          {step === 'upload' && (
            <Button onClick={handleUploadNext} disabled={files.length === 0}>
              {t('common.next')}
            </Button>
          )}
          {step === 'preview' && (
            <Button onClick={handlePreviewNext}>
              {t('common.next')}
            </Button>
          )}
          {step === 'confirm' && (
            <Button onClick={handleImport}>
              {t('inventory.importItems')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
