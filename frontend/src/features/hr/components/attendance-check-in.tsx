/**
 * Attendance Check-In/Check-Out Widget
 * Phase 10: HR Module
 *
 * Clock in/out with current time display
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, LogIn, LogOut, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface AttendanceCheckInProps {
  isCheckedIn: boolean
  lastCheckIn?: string
  lastCheckOut?: string
  onCheckIn: () => void
  onCheckOut: () => void
  isCheckingIn: boolean
  isCheckingOut: boolean
  employeeName: string
}

export function AttendanceCheckIn({
  isCheckedIn,
  lastCheckIn,
  lastCheckOut,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
}: AttendanceCheckInProps) {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {t('hr.attendance')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
            {format(currentTime, 'hh:mm:ss')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {format(currentTime, 'EEEE, dd MMMM yyyy')} - {format(currentTime, 'a')}
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          <Badge variant={isCheckedIn ? 'default' : 'secondary'} className="text-sm px-4 py-1">
            {isCheckedIn ? t('hr.checkedIn') : t('hr.notCheckedIn')}
          </Badge>
        </div>

        {/* Check In/Out Times */}
        {(lastCheckIn || lastCheckOut) && (
          <div className="flex justify-center gap-6 text-sm">
            {lastCheckIn && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t('hr.checkIn')}</p>
                <p className="font-medium text-green-600">{lastCheckIn}</p>
              </div>
            )}
            {lastCheckOut && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t('hr.checkOut')}</p>
                <p className="font-medium text-red-600">{lastCheckOut}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          {!isCheckedIn ? (
            <Button
              size="lg"
              onClick={onCheckIn}
              disabled={isCheckingIn}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 h-12 px-8 text-base"
            >
              {isCheckingIn ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white me-2" />
              ) : (
                <LogIn className="h-5 w-5 me-2" />
              )}
              {t('hr.checkIn')}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              onClick={onCheckOut}
              disabled={isCheckingOut}
              className="w-full sm:w-auto h-12 px-8 text-base"
            >
              {isCheckingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white me-2" />
              ) : (
                <LogOut className="h-5 w-5 me-2" />
              )}
              {t('hr.checkOut')}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          <MapPin className="h-3 w-3 inline me-1" />
          {t('hr.locationRecorded')}
        </p>
      </CardContent>
    </Card>
  )
}

export default AttendanceCheckIn
