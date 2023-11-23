import { FC, ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import ServerBarHeader from './ServerBar.Header'
import ServerBarSearch from './ServerBar.Search'
import ServerBarSection from './ServerBar.Section'
import ServerBarChannel from './ServerBar.Channel'
import ServerBarMember from './ServerBar.Member'
import { IconMap } from '@/config/glob'

type TServerBarProps = {
  serverId: string
}

const iconMap: IconMap<ChannelType> = {
  'TEXT': <Hash className={'h-4 w-4 mr-2'} />,
  'AUDIO': <Mic className={'h-4 w-4 mr-2'} />,
  'VIDEO': <Video className={'h-4 w-4 mr-2'} />,
}

const roleIconMap: IconMap<MemberRole> = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className={'h-4 w-4 mr-2 text-indigo-500'} />,
  'ADMIN': <ShieldAlert className={'h-4 w-4 mr-2 text-rose-500'} />,
}

const ServerBar: FC<TServerBarProps> = async ({ serverId }) => {

  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        }
      }
    }
  })

  if (!server) return redirect('/')

  const textChannels = server?.channels.filter(ch => ch.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(ch => ch.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(ch => ch.type === ChannelType.VIDEO)
  const members = server?.members.filter(mem => mem.profileId !== profile.id)

  const role = server.members.find(mem => mem.profileId === profile.id)?.role

  return (
    <div className={'flex flex-col h-full text-primary w-full bg-[#f2f3f5] dark:bg-[#2b2d31]'}>
      <ServerBarHeader
        server={server}
        role={role}
      />
      <ScrollArea className={'flex-1 px-3'}>
        <div className={'mt-2'}>
          <ServerBarSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>
        <Separator className={'my-2 bg-zinc-200 dark:bg-zinc-700 rounded-md'} />
        {!!textChannels?.length && (
          <div className={'mb-2'}>
            <ServerBarSection
              sectionType={'channels'}
              channelType={ChannelType.TEXT}
              role={role}
              label={'Text Channels'}
            />
            <div className={'space-y-0.5'}>
              {textChannels.map(channel => (
                <ServerBarChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className={'mb-2'}>
            <ServerBarSection
              sectionType={'channels'}
              channelType={ChannelType.AUDIO}
              role={role}
              label={'Voice Channels'}
            />
            <div className={'space-y-0.5'}>
              {audioChannels.map(channel => (
                <ServerBarChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className={'mb-2'}>
            <ServerBarSection
              sectionType={'channels'}
              channelType={ChannelType.VIDEO}
              role={role}
              label={'Voice Channels'}
            />
            <div className={'space-y-0.5'}>
              {videoChannels.map(channel => (
                <ServerBarChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className={'mb-2'}>
            <ServerBarSection
              sectionType={'members'}
              role={role}
              label={'Members'}
              server={server}
            />
            <div className={'space-y-0.5'}>
              {members.map(member => (
                <ServerBarMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerBar