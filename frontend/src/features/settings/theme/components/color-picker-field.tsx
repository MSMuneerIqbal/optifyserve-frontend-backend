/**
 * Color Picker Field
 * Single color input with hex code field and native color picker
 */

import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ColorPickerFieldProps {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export function ColorPickerField({ label, description, value, onChange }: ColorPickerFieldProps) {
  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      // Allow typing - always update if starts with #
      if (val.startsWith('#') && val.length <= 7) {
        onChange(val)
      } else if (!val.startsWith('#')) {
        onChange('#' + val.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6))
      }
    },
    [onChange]
  )

  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.toUpperCase())
    },
    [onChange]
  )

  const isValid = HEX_REGEX.test(value)

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      {/* Native Color Picker */}
      <div className="relative shrink-0">
        <input
          type="color"
          value={isValid ? value : '#000000'}
          onChange={handleColorPickerChange}
          className="h-10 w-10 cursor-pointer rounded-lg border-2 border-border bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-none"
          title={label}
        />
      </div>

      {/* Label & Hex Input */}
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Hex Input */}
      <Input
        value={value}
        onChange={handleHexChange}
        className={`w-24 shrink-0 font-mono text-xs uppercase ${!isValid ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        maxLength={7}
        placeholder="#000000"
      />
    </div>
  )
}
