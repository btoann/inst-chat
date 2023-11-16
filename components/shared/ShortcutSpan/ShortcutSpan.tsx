import { FC } from 'react'

type TShortcutSpan = {
  modifier: string
  keycode: string
}

const ShortcutSpan: FC<TShortcutSpan> = ({ modifier, keycode }) => {
  return (
    <kbd
      className={'h-5 px-1.5 ml-auto inline-flex gap-1 items-center text-[0.625rem] font-mono font-medium text-muted-foreground bg-muted rounded border select-none pointer-events-none'}
    >
      <span className={'text-xs'}>{modifier}</span>
      <span>{keycode}</span>
    </kbd>
  )
}

export default ShortcutSpan