import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Plus,
  Phone,
  User,
  Pencil,
  Trash2,
  Building2,
  Users,
  CheckCircle2,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { UAE_EMIRATES } from '@/lib/constants';
import type { Branch, BranchFormData } from '../../types/settings.types';
import { sampleBranches as mockBranches } from '@/data/settings.data';

const defaultFormData: BranchFormData = {
  code: '',
  name: '',
  address: {
    street: '',
    city: '',
    emirate: '',
  },
  contactPerson: '',
  phone: '',
  isDefault: false,
};

export function BranchManagement() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BranchFormData>(defaultFormData);

  const stats = {
    total: branches.length,
    active: branches.filter((b) => b.isActive).length,
    totalEmployees: branches.reduce((sum, b) => sum + b.employeeCount, 0),
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingBranch(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      code: branch.code,
      name: branch.name,
      address: { ...branch.address },
      contactPerson: branch.contactPerson,
      phone: branch.phone,
      isDefault: branch.isDefault,
    });
    setIsAddDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id
            ? {
                ...b,
                ...formData,
                address: { ...formData.address },
              }
            : formData.isDefault
            ? { ...b, isDefault: false }
            : b
        )
      );
    } else {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        code: formData.code,
        name: formData.name,
        address: { ...formData.address },
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        isDefault: formData.isDefault,
        isActive: true,
        employeeCount: 0,
        createdAt: new Date().toISOString(),
      };
      if (formData.isDefault) {
        setBranches((prev) =>
          prev.map((b) => ({ ...b, isDefault: false })).concat(newBranch)
        );
      } else {
        setBranches((prev) => [...prev, newBranch]);
      }
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingBranchId) {
      setBranches((prev) => prev.filter((b) => b.id !== deletingBranchId));
      setDeletingBranchId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.totalBranches')}</p>
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
              <p className="text-sm text-muted-foreground">{t('settings.activeBranches')}</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('settings.totalEmployees')}</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Cards Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('settings.branches')}</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 me-2" />
              {t('settings.addBranch')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? t('settings.editBranch') : t('settings.addNewBranch')}
              </DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? t('settings.editBranchDescription')
                  : t('settings.addBranchDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branchCode">{t('settings.branchCode')}</Label>
                  <Input
                    id="branchCode"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder={t('settings.branchCodePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchName">{t('settings.branchName')}</Label>
                  <Input
                    id="branchName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t('settings.branchNamePlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">{t('settings.streetAddress')}</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  placeholder={t('settings.streetAddressPlaceholder')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('settings.city')}</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                    placeholder={t('settings.cityPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.emirate')}</Label>
                  <Select
                    value={formData.address.emirate}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: { ...prev.address, emirate: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('settings.selectEmirate')} />
                    </SelectTrigger>
                    <SelectContent>
                      {UAE_EMIRATES.map((emirate) => (
                        <SelectItem key={emirate} value={emirate}>
                          {emirate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">{t('settings.contactPerson')}</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))
                    }
                    placeholder={t('settings.fullNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchPhone">{t('settings.phone')}</Label>
                  <Input
                    id="branchPhone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder={t('settings.branchPhonePlaceholder')}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isDefault: checked === true }))
                  }
                />
                <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                  {t('settings.setAsDefaultBranch')}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                {t('settings.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={!formData.code || !formData.name}>
                {editingBranch ? t('settings.updateBranch') : t('settings.createBranch')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className={cn(
              'relative',
              branch.isDefault && 'ring-2 ring-primary'
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{branch.name}</CardTitle>
                  <Badge variant="outline" className="text-xs font-mono">
                    {branch.code}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenEdit(branch)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => setDeletingBranchId(branch.id)}
                    disabled={branch.isDefault}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                {branch.isDefault && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {t('settings.default')}
                  </Badge>
                )}
                {branch.isActive ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    {t('settings.active')}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                    {t('settings.inactive')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  {branch.address.street}, {branch.address.city}, {branch.address.emirate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{branch.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm pt-1 border-t">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {branch.employeeCount} {t('settings.employees')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingBranchId}
        onOpenChange={(open) => !open && setDeletingBranchId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.deleteBranch')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.deleteBranchConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('settings.deleteBranch')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
