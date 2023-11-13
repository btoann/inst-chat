import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'

const Home = () => {
  return (
    <div>
      <p className={'text-3xl font-bold text-indigo-500'}>
        Hello world!
      </p>
      <Button variant={'default'}>
        <UserButton
          afterSignOutUrl={'/'}
        />
      </Button>
    </div>
  )
}

export default Home