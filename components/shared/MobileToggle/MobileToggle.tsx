import { FC } from 'react'
import { Menu } from 'lucide-react'
import {
  Sheet, SheetContent, SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/shared/Navigation'
import ServerBar from '@/components/shared/ServerBar'

type TMobileToggleProps = {
  serverId: string
}

const MobileToggle: FC<TMobileToggleProps> = ({
  serverId
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={'md:hidden'}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className={'p-0 flex gap-0'}
      >
        <div className={'w-[4.5rem]'}>
          <Navigation />
        </div>
        <ServerBar
          serverId={serverId}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle