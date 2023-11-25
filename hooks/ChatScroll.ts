import { RefObject, useState, useEffect } from 'react'

type TChatScrollProps = {
  chatRef: RefObject<HTMLDivElement>
  bottomRef: RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  count: number
}

const useChatScroll = ({
  chatRef, bottomRef, shouldLoadMore, loadMore, count,
}: TChatScrollProps) => {

  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const topDiv = chatRef?.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }
    
    topDiv?.addEventListener('scroll', handleScroll)

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll)
    }
  }, [chatRef, shouldLoadMore, loadMore])

  useEffect(() => {
    const bottomDiv = bottomRef?.current
    const topDiv = chatRef?.current
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }

      if (!topDiv) return false

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceFromBottom <= 100
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [chatRef, bottomRef, count, hasInitialized])

}

export {
  useChatScroll,
}