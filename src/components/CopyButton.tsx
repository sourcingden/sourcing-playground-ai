import { useToastStore } from '../store/useToastStore'
import { copyToClipboard } from '../utils/clipboard'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, label = 'Copy', size = 'sm' }: CopyButtonProps) {
  const showToast = useToastStore((s) => s.showToast)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Copied to clipboard!')
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <button
      onClick={handleCopy}
      className={`${sizeClasses} bg-surface hover:bg-surface-lighter border border-border rounded-lg transition-colors cursor-pointer text-text-muted hover:text-text flex items-center gap-1.5`}
    >
      <span>📋</span>
      {label}
    </button>
  )
}
