import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Loader2,
  Clock,
  Paperclip,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExportModule {
  id: string;
  label: string;
  description: string;
  recordCount: number;
}

interface RecentExport {
  id: string;
  date: string;
  modules: string[];
  format: string;
  size: string;
  status: 'completed' | 'processing' | 'failed';
}

const MODULE_KEYS: Array<{ id: string; labelKey: string; descriptionKey: string; recordCount: number }> = [
  { id: 'crm', labelKey: 'settings.exportModuleCRM', descriptionKey: 'settings.exportDescCRM', recordCount: 1245 },
  { id: 'sales', labelKey: 'settings.exportModuleSales', descriptionKey: 'settings.exportDescSales', recordCount: 3420 },
  { id: 'inventory', labelKey: 'settings.exportModuleInventory', descriptionKey: 'settings.exportDescInventory', recordCount: 8760 },
  { id: 'purchase', labelKey: 'settings.exportModulePurchase', descriptionKey: 'settings.exportDescPurchase', recordCount: 2100 },
  { id: 'accounts', labelKey: 'settings.exportModuleAccounts', descriptionKey: 'settings.exportDescAccounts', recordCount: 15600 },
  { id: 'hr', labelKey: 'settings.exportModuleHR', descriptionKey: 'settings.exportDescHR', recordCount: 450 },
  { id: 'projects', labelKey: 'settings.exportModuleProjects', descriptionKey: 'settings.exportDescProjects', recordCount: 5230 },
];

const recentExports: RecentExport[] = [
  {
    id: '1',
    date: '2025-02-20 09:15 AM',
    modules: ['CRM', 'Sales'],
    format: 'xlsx',
    size: '4.2 MB',
    status: 'completed',
  },
  {
    id: '2',
    date: '2025-02-18 03:30 PM',
    modules: ['Inventory'],
    format: 'csv',
    size: '12.8 MB',
    status: 'completed',
  },
  {
    id: '3',
    date: '2025-02-15 11:00 AM',
    modules: ['Accounts', 'HR', 'Sales'],
    format: 'json',
    size: '8.5 MB',
    status: 'completed',
  },
];

const formatIcons: Record<string, React.ElementType> = {
  xlsx: FileSpreadsheet,
  csv: FileText,
  json: FileJson,
};

export function DataExport() {
  const { t } = useTranslation();

  const modules: ExportModule[] = MODULE_KEYS.map((m) => ({
    id: m.id,
    label: t(m.labelKey),
    description: t(m.descriptionKey),
    recordCount: m.recordCount,
  }));

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [format, setFormat] = useState<string>('xlsx');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleAllModules = () => {
    if (selectedModules.length === modules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(modules.map((m) => m.id));
    }
  };

  const totalRecords = modules
    .filter((m) => selectedModules.includes(m.id))
    .reduce((sum, m) => sum + m.recordCount, 0);

  const handleExport = async () => {
    if (selectedModules.length === 0) {
      toast.error(t('settings.exportSelectModuleError'));
      return;
    }

    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsExporting(false);
    toast.success(t('settings.exportCompletedSuccess'));
  };

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <CardTitle>{t('settings.dataExport')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.dataExportDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Module Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">{t('settings.selectModules')}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAllModules}
                className="text-xs h-7"
              >
                {selectedModules.length === modules.length
                  ? t('settings.deselectAll')
                  : t('settings.selectAll')}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                    selectedModules.includes(module.id)
                      ? 'border-primary/30 bg-primary/5'
                      : 'hover:bg-slate-50'
                  )}
                  onClick={() => toggleModule(module.id)}
                >
                  <Checkbox
                    checked={selectedModules.includes(module.id)}
                    onCheckedChange={() => toggleModule(module.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{module.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {module.recordCount.toLocaleString()} {t('settings.records')}
                  </Badge>
                </div>
              ))}
            </div>
            {selectedModules.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t('settings.totalRecordsToExport')}{' '}
                <span className="font-semibold text-slate-700">
                  {totalRecords.toLocaleString()}
                </span>
              </p>
            )}
          </div>

          <Separator />

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label>{t('settings.exportFormat')}</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      {t('settings.formatExcel')}
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      {t('settings.formatCsv')}
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4 text-amber-600" />
                      {t('settings.formatJson')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>{t('settings.fromDate')}</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.toDate')}</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Include Attachments */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-slate-500" />
              <div>
                <Label className="font-medium">{t('settings.includeAttachments')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('settings.includeAttachmentsDescription')}
                </p>
              </div>
            </div>
            <Switch
              checked={includeAttachments}
              onCheckedChange={setIncludeAttachments}
            />
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedModules.length === 0}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('settings.exporting')}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t('settings.exportData')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{t('settings.recentExports')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.recentExportsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExports.map((exportItem) => {
              const FormatIcon = formatIcons[exportItem.format] || Package;
              return (
                <div
                  key={exportItem.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                      <FormatIcon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {exportItem.modules.join(', ')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{exportItem.date}</span>
                        <span className="text-slate-300">|</span>
                        <span>.{exportItem.format}</span>
                        <span className="text-slate-300">|</span>
                        <span>{exportItem.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        'text-xs capitalize',
                        statusColors[exportItem.status]
                      )}
                    >
                      {t(`settings.exportStatus.${exportItem.status}`)}
                    </Badge>
                    {exportItem.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 h-8"
                        onClick={() =>
                          toast.info(t('settings.downloadStarted'))
                        }
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t('settings.download')}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
