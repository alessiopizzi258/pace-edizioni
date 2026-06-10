// components/admin/SubmitButton.tsx
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={`bg-stone-900 text-stone-50 px-6 py-3 text-xs uppercase tracking-wider font-mono ${className}`}>
      {pending ? 'Salvataggio...' : children}
    </button>
  )
}