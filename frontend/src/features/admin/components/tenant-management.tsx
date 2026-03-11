import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
  LayoutGrid,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Tenant, TenantFormData, SubscriptionPlan } from '../types/admin.types';
import { sampleTenants as mockTenants } from '@/data/admin.data';

const AVAILABLE_MODULES = [
  'CRM',
  'Sales',
  'Inventory',
  'Purchase',
  'Accounts',
  'HR',
  'Projects',
  'Dispatcher',
];

const planBadgeColors: Record<string, string> = {
  basic: 'bg-gray-100 text-gray-700 border-gray-200',
  standard: 'bg-blue-100 text-blue-700 border-blue-200',
  premium: 'bg-purple-100 text-purple-700 border-purple-200',
  enterprise: 'bg-amber-100 text-amber-700 border-amber-200',
};

const statusBadgeColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  trial: 'bg-blue-100 text-blue-700 border-blue-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
};

const defaultFormData: TenantFormData = {
  companyName: '',
  trn: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  plan: 'standard',
  enabledModules: ['CRM', 'Sales'],
  trialDays: 14,
};

export function TenantManagement() {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>(defaultFormData);

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === 'active').length,
    trial: tenants.filter((t) => t.status === 'trial').length,
    suspended: tenants.filter((t) => t.status === 'suspended').length,
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      searchQuery === '' ||
      tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleAddTenant = () => {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      companyName: formData.companyName,
      trn: formData.trn,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      plan: formData.plan,
      status: formData.trialDays > 0 ? 'trial' : 'active',
      enabledModules: formData.enabledModules,
      userCount: 1,
      branchCount: 1,
      storageUsedMB: 0,
      monthlyRevenue: 0,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setTenants((prev) => [newTenant, ...prev]);
    setFormData(defaultFormData);
    setIsAddDialogOpen(false);
  };

  const handleToggleSuspend = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, status: t.status === 'suspended' ? 'active' : 'suspended' }
          : t
      )
    );
  };

  const handleModuleToggle = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      enabledModules: prev.enabledModules.includes(module)
        ? prev.enabledModules.filter((m) => m !== module)
        : [...prev.enabledModules, module],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.totalTenants')}</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.active')}</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.trial')}</p>
              <p className="text-2xl font-bold">{stats.trial}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.suspended')}</p>
              <p className="text-2xl font-bold">{stats.suspended}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filters, and Add Button */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">{t('settings.tenantDirectory')}</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 me-2" />
                  {t('settings.addTenant')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('settings.addNewTenant')}</DialogTitle>
                  <DialogDescription>
                    {t('settings.addTenantDescription')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                      }
                      placeholder={t('settings.companyNamePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trn">{t('settings.taxRegistrationNumber')}</Label>
                    <Input
                      id="trn"
                      value={formData.trn}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, trn: e.target.value }))
                      }
                      placeholder={t('settings.trnPlaceholder')}
                      maxLength={15}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{t('settings.ownerName')}</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, ownerName: e.target.value }))
                        }
                        placeholder={t('settings.fullNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">{t('settings.ownerPhone')}</Label>
                      <Input
                        id="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, ownerPhone: e.target.value }))
                        }
                        placeholder={t('settings.phonePlaceholder')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">{t('settings.ownerEmail')}</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ownerEmail: e.target.value }))
                      }
                      placeholder={t('settings.ownerEmailPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.subscriptionPlan')}</Label>
                    <Select
                      value={formData.plan}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, plan: value as SubscriptionPlan }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('settings.selectPlan')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">{t('settings.planBasic')}</SelectItem>
                        <SelectItem value="standard">{t('settings.planStandard')}</SelectItem>
                        <SelectItem value="premium">{t('settings.planPremium')}</SelectItem>
                        <SelectItem value="enterprise">{t('settings.planEnterprise')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.modules')}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_MODULES.map((module) => (
                        <div key={module} className="flex items-center gap-2">
                          <Checkbox
                            id={`module-${module}`}
                            checked={formData.enabledModules.includes(module)}
                            onCheckedChange={() => handleModuleToggle(module)}
                          />
                          <Label
                            htmlFor={`module-${module}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {module}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trialDays">{t('settings.trialPeriodDays')}</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      value={formData.trialDays}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          trialDays: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      min={0}
                      max={90}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t('settings.cancel')}
                  </Button>
                  <Button
                    onClick={handleAddTenant}
                    disabled={!formData.companyName || !formData.ownerEmail}
                  >
                    {t('settings.createTenant')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('settings.searchTenantsPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={t('settings.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('settings.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('settings.active')}</SelectItem>
                <SelectItem value="trial">{t('settings.trial')}</SelectItem>
                <SelectItem value="suspended">{t('settings.suspended')}</SelectItem>
                <SelectItem value="cancelled">{t('settings.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder={t('settings.plan')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('settings.allPlans')}</SelectItem>
                <SelectItem value="basic">{t('settings.planBasic')}</SelectItem>
                <SelectItem value="standard">{t('settings.planStandard')}</SelectItem>
                <SelectItem value="premium">{t('settings.planPremium')}</SelectItem>
                <SelectItem value="enterprise">{t('settings.planEnterprise')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('settings.company')}</TableHead>
                  <TableHead>{t('settings.owner')}</TableHead>
                  <TableHead>{t('settings.plan')}</TableHead>
                  <TableHead>{t('settings.status')}</TableHead>
                  <TableHead className="text-center">{t('settings.modules')}</TableHead>
                  <TableHead className="text-center">{t('settings.users')}</TableHead>
                  <TableHead className="text-end">{t('settings.monthlyRevenue')}</TableHead>
                  <TableHead>{t('settings.lastLogin')}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {t('settings.noTenantsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tenant.companyName}</p>
                            <p className="text-xs text-muted-foreground">
                              {t('settings.trn')}: {tenant.trn || t('settings.notAvailable')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{tenant.ownerName}</p>
                          <p className="text-xs text-muted-foreground">{tenant.ownerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('capitalize', planBadgeColors[tenant.plan])}
                        >
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('capitalize', statusBadgeColors[tenant.status])}
                        >
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{tenant.enabledModules.length}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{tenant.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        <span className="text-sm font-medium">
                          AED {tenant.monthlyRevenue.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {tenant.lastLoginAt
                            ? new Date(tenant.lastLoginAt).toLocaleDateString('en-GB')
                            : t('settings.never')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 me-2" />
                              {t('settings.viewDetails')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 me-2" />
                              {t('settings.editTenant')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <LayoutGrid className="h-4 w-4 me-2" />
                              {t('settings.assignModules')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleSuspend(tenant.id)}
                              className={
                                tenant.status === 'suspended'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {tenant.status === 'suspended' ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 me-2" />
                                  {t('settings.activate')}
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 me-2" />
                                  {t('settings.suspend')}
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {t('settings.showingTenants', { filtered: filteredTenants.length, total: tenants.length })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
