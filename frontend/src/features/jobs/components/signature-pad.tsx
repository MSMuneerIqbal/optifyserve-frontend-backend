/**
 * Signature Pad Component
 * Phase 11: Jobs/Service Management Module
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eraser, Check } from 'lucide-react'

interface SignaturePadProps {
  label: string
  onSignature: (dataUrl: string) => void
  initialSignature?: string
}

export function SignaturePad({ label, onSignature, initialSignature }: SignaturePadProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!initialSignature)

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    return ctx
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(2, 2)
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    // Load initial signature if exists
    if (initialSignature) {
      const img = new Image()
      img.onload = () => ctx?.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = initialSignature
    }
  }, [initialSignature])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const ctx = getContext()
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
    setHasSignature(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = getContext()
    if (!ctx) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return
    const dataUrl = canvas.toDataURL('image/png')
    onSignature(dataUrl)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Card className="p-1">
        <canvas
          ref={canvasRef}
          className="w-full h-32 sm:h-40 border rounded cursor-crosshair touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Card>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
          <Eraser className="h-4 w-4 me-1" />{t('common.clear')}
        </Button>
        <Button type="button" size="sm" onClick={saveSignature} disabled={!hasSignature}>
          <Check className="h-4 w-4 me-1" />{t('jobs.saveSignature')}
        </Button>
      </div>
    </div>
  )
}

export default SignaturePad
