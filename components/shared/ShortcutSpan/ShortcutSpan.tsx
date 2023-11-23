import { FC, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TShortcutSpan = {
  modifier?: string
  keycode?: string
  modifierClasses?: string
  keycodeClasses?: string
}

const ShortcutSpan: FC<TShortcutSpan> = ({ modifier, keycode, modifierClasses = '', keycodeClasses = '' }) => {
  return (
    <kbd
      className={'h-5 px-1.5 ml-auto inline-flex gap-1 items-center text-[0.625rem] font-mono font-medium text-muted-foreground bg-muted rounded border select-none pointer-events-none'}
    >
      {modifier && (
        <span className={cn(modifierClasses)}>{modifier}</span>
      )}
      {keycode && (
        <span className={cn(keycodeClasses)}>{keycode}</span>
      )}
    </kbd>
  )
}

export default ShortcutSpan