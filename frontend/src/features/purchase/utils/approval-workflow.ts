/**
 * Approval Workflow Utility
 * Phase 8: Purchase Module
 *
 * Determine approval requirements based on PO value
 */

import type { ApprovalLevel } from '../types/purchase-order.types'

/**
 * Approval thresholds (in AED)
 */
const APPROVAL_THRESHOLDS = {
  AUTO_APPROVE_LIMIT: 10000,      // < AED 10,000: Auto-approved
  MANAGER_APPROVE_LIMIT: 50000,   // AED 10,000 - 50,000: Manager approval
  // > AED 50,000: Manager + Owner approval
}

/**
 * Determine the required approval level based on PO total value
 */
export function getApprovalLevel(totalAmount: number): ApprovalLevel {
  if (totalAmount < APPROVAL_THRESHOLDS.AUTO_APPROVE_LIMIT) {
    return 'auto'
  }
  if (totalAmount <= APPROVAL_THRESHOLDS.MANAGER_APPROVE_LIMIT) {
    return 'manager'
  }
  return 'owner'
}

/**
 * Get approval level display info
 */
export function getApprovalLevelInfo(level: ApprovalLevel): {
  key: string
  descriptionKey: string
  requiredApprovers: string[]
} {
  switch (level) {
    case 'auto':
      return {
        key: 'purchase.approvalLevelLabel.auto',
        descriptionKey: 'purchase.approvalDescAuto',
        requiredApprovers: [],
      }
    case 'manager':
      return {
        key: 'purchase.approvalLevelLabel.manager',
        descriptionKey: 'purchase.approvalDescManager',
        requiredApprovers: ['Manager'],
      }
    case 'owner':
      return {
        key: 'purchase.approvalLevelLabel.owner',
        descriptionKey: 'purchase.approvalDescOwner',
        requiredApprovers: ['Manager', 'Owner'],
      }
  }
}

/**
 * Check if a user can approve a PO
 * Creator cannot approve their own PO
 */
export function canApprove(
  userRole: string,
  userId: string,
  creatorId: string,
  approvalLevel: ApprovalLevel
): boolean {
  // Creator cannot approve their own PO
  if (userId === creatorId) return false

  // Auto-approved POs don't need manual approval
  if (approvalLevel === 'auto') return false

  // Manager level: managers and owners can approve
  if (approvalLevel === 'manager') {
    return userRole === 'manager' || userRole === 'admin'
  }

  // Owner level: only admin/owner can approve
  if (approvalLevel === 'owner') {
    return userRole === 'admin'
  }

  return false
}

/**
 * Format approval threshold for display
 */
export function formatApprovalThreshold(): string {
  return `Auto: < AED ${APPROVAL_THRESHOLDS.AUTO_APPROVE_LIMIT.toLocaleString()} | Manager: AED ${APPROVAL_THRESHOLDS.AUTO_APPROVE_LIMIT.toLocaleString()} - ${APPROVAL_THRESHOLDS.MANAGER_APPROVE_LIMIT.toLocaleString()} | Owner: > AED ${APPROVAL_THRESHOLDS.MANAGER_APPROVE_LIMIT.toLocaleString()}`
}
