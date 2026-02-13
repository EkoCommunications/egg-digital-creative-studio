import { ShieldCheck, ShieldAlert, ShieldX, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Brand CI Validation badge component.
 * Shows a compliance score and status for generated creatives.
 * 
 * In the MVP, this generates a simulated score based on segment/ratio.
 * In production, this would call the actual Brand CI Validator service.
 */

const COMPLIANCE_LEVELS = {
  COMPLIANT: { label: 'Compliant', color: 'text-brand-success', bgColor: 'bg-brand-success/10', borderColor: 'border-brand-success/30', icon: ShieldCheck },
  REVIEW_NEEDED: { label: 'Review Needed', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/30', icon: ShieldAlert },
  MAJOR_REVISIONS: { label: 'Major Revisions', color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400/30', icon: ShieldAlert },
  NON_COMPLIANT: { label: 'Non-Compliant', color: 'text-brand-danger', bgColor: 'bg-brand-danger/10', borderColor: 'border-brand-danger/30', icon: ShieldX },
}

function getComplianceLevel(score) {
  if (score >= 80) return 'COMPLIANT'
  if (score >= 60) return 'REVIEW_NEEDED'
  if (score >= 40) return 'MAJOR_REVISIONS'
  return 'NON_COMPLIANT'
}

// Simulated CI score for MVP demo purposes
function simulateCIScore(segmentId) {
  // Generate a deterministic but varied score per segment
  const hash = segmentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const base = 65 + (hash % 30) // Range: 65-94
  return Math.min(base, 100)
}

export default function CIValidationBadge({ segmentId, compact = false }) {
  if (!segmentId) return null

  const score = simulateCIScore(segmentId)
  const level = getComplianceLevel(score)
  const config = COMPLIANCE_LEVELS[level]
  const Icon = config.icon

  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border',
          config.color,
          config.bgColor,
          config.borderColor,
        )}
        title={`Brand CI Score: ${score}/100 - ${config.label}`}
      >
        <Icon className="w-3 h-3" />
        <span>{score}</span>
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs',
      config.color,
      config.bgColor,
      config.borderColor,
    )}>
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex flex-col">
        <span className="font-semibold">{config.label}</span>
        <span className="text-[10px] opacity-75">CI Score: {score}/100</span>
      </div>
    </div>
  )
}
