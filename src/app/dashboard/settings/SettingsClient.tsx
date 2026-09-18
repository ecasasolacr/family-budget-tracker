'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check } from 'lucide-react'

export function SettingsClient({ familyId }: { familyId: string }) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/onboarding?inviteCode=${familyId}`
    : ''

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="familyCode">Código de Familia</Label>
        <div className="flex gap-2">
          <Input 
            id="familyCode" 
            value={familyId} 
            readOnly 
            className="font-mono bg-slate-50 dark:bg-slate-900"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => copyToClipboard(familyId, setCopiedCode)}
            title="Copiar código"
          >
            {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inviteLink">Enlace de Invitación</Label>
        <div className="flex gap-2">
          <Input 
            id="inviteLink" 
            value={inviteLink} 
            readOnly 
            className="font-mono bg-slate-50 dark:bg-slate-900 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => copyToClipboard(inviteLink, setCopiedLink)}
            title="Copiar enlace"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Comparte este enlace para que otras personas se unan directamente a tu familia.
        </p>
      </div>
    </div>
  )
}
