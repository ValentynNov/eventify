'use client'

import { Badge } from '@/components/core/Badge/Badge'
import { Card, CardDescription } from '@/components/core/Card/Card'
import { categoryLabel, formatLabel } from '@/features/events/labels/eventDisplay'
import type { EventDto } from '@/types/api'
import { formatDateTimeUtc } from '@/lib/datetime'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

type Props = {
	event: EventDto
}

export const EventCard = ({ event }: Props) => {
	const taken = event.approvedRegistrationCount ?? 0
	const free = Math.max(0, event.capacity - taken)

	return (
		<Link
			href={`/events/${event.id}`}
			className='group block rounded-xl border border-transparent text-left outline-none ring-purple-600 transition hover:border-purple-200 focus-visible:ring-2'
		>
			<Card className='h-full gap-4 p-5 transition-colors group-hover:border-purple-300'>
				<div className='flex flex-wrap gap-2'>
					<Badge className='bg-purple-50 text-purple-700'>
						<MapPin className='mr-1 inline h-3 w-3' aria-hidden />
						{event.location}
					</Badge>
					<Badge>
						<Users className='mr-1 inline h-3 w-3' aria-hidden />
						{free > 0
							? `вільно ${free} з ${event.capacity}`
							: `до ${event.capacity}`}
					</Badge>
					{event.category ? (
						<Badge className='border border-purple-100 bg-purple-50/80 text-purple-800'>
							{categoryLabel(event.category)}
						</Badge>
					) : null}
					{event.format ? (
						<Badge className='border border-gray-200 bg-white text-gray-700'>
							{formatLabel(event.format)}
						</Badge>
					) : null}
				</div>

				<div>
					<h3 className='text-lg font-semibold text-gray-900 group-hover:text-purple-700'>
						{event.title}
					</h3>
					<p className='mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500'>
						<CalendarDays className='h-4 w-4 text-blue-500' aria-hidden />
						<span>{formatDateTimeUtc(event.date)}</span>
					</p>
				</div>

				<CardDescription className='mb-0 line-clamp-3 text-sm'>
					{event.description}
				</CardDescription>
			</Card>
		</Link>
	)
}
