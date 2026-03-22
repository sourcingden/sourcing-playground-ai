interface TagListProps {
  tags: string[]
  onTagClick?: (tag: string) => void
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'rose'
  size?: 'sm' | 'md'
}

const colorMap = {
  blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30 hover:bg-accent-blue/25',
  green: 'bg-accent-green/15 text-accent-green border-accent-green/30 hover:bg-accent-green/25',
  amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30 hover:bg-accent-amber/25',
  purple: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30 hover:bg-accent-purple/25',
  rose: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30 hover:bg-accent-rose/25',
}

export function TagList({ tags, onTagClick, color = 'blue', size = 'sm' }: TagListProps) {
  if (tags.length === 0) return null

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0" role="list">
      {tags.map((tag) => (
        <li key={tag} role="listitem">
          <button
            onClick={() => onTagClick?.(tag)}
            aria-label={onTagClick ? `Add "${tag}" to boolean builder` : tag}
            className={`${colorMap[color]} ${sizeClass} rounded-md border font-medium transition-colors cursor-pointer`}
          >
            {tag}
            {onTagClick && <span className="ml-1 opacity-60" aria-hidden="true">+</span>}
          </button>
        </li>
      ))}
    </ul>
  )
}
