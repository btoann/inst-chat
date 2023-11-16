'use client'

import { FC, ReactNode } from 'react'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip'

type TActionToolTipProps = {
  label: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  children: ReactNode
}

const ActionToolTip: FC<TActionToolTipProps> = ({ label, side, align, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
        >
          <p className={'font-semibold text-sm capitalize'}>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionToolTip