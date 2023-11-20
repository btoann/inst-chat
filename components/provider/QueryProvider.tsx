'use client'

import { FC, PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

const QueryProvider: FC<PropsWithChildren> = ({ children }) => {

  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider