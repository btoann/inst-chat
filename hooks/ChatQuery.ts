import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/config/queryKeys'
import { useSocketContext } from '@/components/provider/SocketProvider'

type TChatQueryProps = {
  chatId: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

const useChatQuery = ({
  chatId, apiUrl, paramKey, paramValue
}: TChatQueryProps) => {

  const { isConnected } = useSocketContext()

  const fetchMessage = async ({ pageParam }: { pageParam?: string }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      }
    }, { skipNull: true })

    const res = await fetch(url)
    return res.json()
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, chatId],
    queryFn: fetchMessage,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}

export {
  useChatQuery,
}