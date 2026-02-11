interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
          selected === null ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
        }`}
      >
        All Categories
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            selected === category
              ? 'bg-accent text-accent-foreground'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
