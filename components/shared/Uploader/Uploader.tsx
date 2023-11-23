'use client'

import { FC } from 'react'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'

type TUploaderProps = {
  endpoint: 'messageFile' | 'serverImage'
  value: string
  onChange: (url?: string) => void
}

const Uploader: FC<TUploaderProps> = ({ endpoint, value, onChange }) => {

  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') return (
    <div className={'relative h-20 w-20'}>
      <Image
        src={value}
        alt={'upload'}
        fill
        className={'rounded-full object-cover'}
      />
      <button
        type={'button'}
        className={'bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'}
        onClick={() => onChange('')}
      >
        <X className={'h-4 w-4'} />
      </button>
    </div>
  )

  if (value && fileType === 'pdf') return (
    <div className={'relative p-2 mt-2 flex items-center rounded-md bg-background/10'}>
      <FileIcon className={'h-10 w-10 fill-indigo-200 stroke-indigo-400'} />
      <a
        href={value}
        target={'_blank'}
        rel={'noopener noreferrer'}
        className={'ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'}
      >
        {value}
      </a>
      <button
        type={'button'}
        className={'bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'}
        onClick={() => onChange('')}
      >
        <X className={'h-4 w-4'} />
      </button>
    </div>
  )

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(err) => {
        console.error(err)
      }}
    />
  )
}

export default Uploader