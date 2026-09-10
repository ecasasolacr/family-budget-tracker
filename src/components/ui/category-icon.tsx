import { Tag, ShoppingCart, Car, Zap, Film, Heart, Home, Laptop, PiggyBank, Briefcase, GraduationCap, Utensils, Activity, ShoppingBag } from 'lucide-react'

export const CATEGORY_ICONS: Record<string, any> = {
  ShoppingCart, Car, Zap, Film, Heart, Home, Laptop, PiggyBank, Briefcase, GraduationCap, Utensils, Activity, ShoppingBag, Tag
}

export function CategoryIcon({ iconName, className }: { iconName?: string | null, className?: string }) {
  const IconComp = iconName && CATEGORY_ICONS[iconName] ? CATEGORY_ICONS[iconName] : Tag;
  return <IconComp className={className} />
}

export function CategoryBadge({ name, icon, color, className }: { name: string, icon?: string | null, color?: string | null, className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0"
        style={{ backgroundColor: color || '#10b981' }}
      >
        <CategoryIcon iconName={icon} className="w-3.5 h-3.5" />
      </div>
      <span className="truncate">{name}</span>
    </div>
  )
}
