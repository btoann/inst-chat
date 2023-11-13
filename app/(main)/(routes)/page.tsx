import ThemeSwitcher from '@/components/shared/ThemeSwitcher'
import { UserButton } from '@clerk/nextjs'

const Home = () => {
  return (
    <div>
      <p className={'text-3xl font-bold text-indigo-500'}>
        Hello world!
      </p>
      <UserButton
        afterSignOutUrl={'/'}
      />
      <ThemeSwitcher />
    </div>
  )
}

export default Home