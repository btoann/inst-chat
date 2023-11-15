'use client'

import { FC } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'

interface IUploaderProps {
  endpoint: 'messageFile' | 'serverImage'
  value: string
  onChange: (url?: string) => void
}

const Uploader: FC<IUploaderProps> = ({ endpoint, value, onChange }) => {

  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') return (
    <div className={'relative h-20 w-20'}>
      <Image
        fill
        src={value}
        alt={'upload'}
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