'use client'

import { Button } from '@/components/core/Button/Button'
import { Card } from '@/components/core/Card/Card'
import { Loader } from '@/components/core/Loader/Loader'
import { Badge } from '@/components/core/Badge/Badge'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { formatDateTimeUtc } from '@/lib/datetime'
import type { EventDto } from '@/types/api'
import { useEvents } from '@/queries/useEvents'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

const startOfCalendarMonthUtc = (year: number, monthIndex: number) =>
	new Date(Date.UTC(year, monthIndex, 1))

const mondayWeekdayUtc = (d: Date) => {
	const dow = d.getUTCDay()
	const mondayAligned = dow === 0 ? 6 : dow - 1
	return mondayAligned
}

const daysInMonthUtc = (year: number, monthIndex: number) =>
	new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()

const monthMatrix = (year: number, monthIndex: number) => {
	const first = startOfCalendarMonthUtc(year, monthIndex)
	const leadingBlank = mondayWeekdayUtc(first)
	const dim = daysInMonthUtc(year, monthIndex)

	const cells: ({ day: number } | null)[][] = []
	let current: ({ day: number } | null)[] = []

	for (let i = 0; i < leadingBlank; i++) {
		current.push(null)
	}

	for (let day = 1; day <= dim; day++) {
		if (current.length === 7) {
			cells.push(current)
			current = []
		}
		current.push({ day })
	}

	while (current.length && current.length < 7) {
		current.push(null)
	}

	if (current.length) cells.push(current)

	return cells
}

const groupEventsByUtcDay = (events: EventDto[]) => {
	const map = new Map<string, EventDto[]>()
	for (const e of events) {
		const d = new Date(e.date)
		const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
			2,
			'0'
		)}-${String(d.getUTCDate()).padStart(2, '0')}`
		const bucket = map.get(key) ?? []
		bucket.push(e)
		map.set(key, bucket)
	}
	return map
}

export const CalendarPageView = () => {
	const [cursor, setCursor] = useState(() => {
		const d = new Date()
		return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
	})

	const year = cursor.getUTCFullYear()
	const month = cursor.getUTCMonth()

	const { data, isLoading } = useEvents({
		pageNumber: 1,
		pageSize: 100,
		sortBy: 'date',
		sortOrder: 'asc'
	})

	const byDay = useMemo(
		() => groupEventsByUtcDay(data?.items ?? []),
		[data?.items]
	)

	const grid = useMemo(() => monthMatrix(year, month), [year, month])

	const heading = cursor.toLocaleString('uk-UA', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	})

	const pad = (n: number) => String(n).padStart(2, '0')

	if (isLoading) {
		return (
			<div className='flex justify-center py-24'>
				<Loader />
			</div>
		)
	}

	if (!data?.items?.length) {
		return (
			<div className='space-y-8'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Календар подій (UTC)
					</h1>
					<p className='mt-2 text-gray-500'>
						Події синхронізовані із API й згруповані за календарними днями
						сервера.
					</p>
				</div>
				<EmptyState
					icon={CalendarDays}
					title='Подій немає'
					description='Спробуйте додати заходи в API або перевірити з’єднання.'
					action={<Link href='/events'>На сторінку подій</Link>}
				/>
			</div>
		)
	}

	return (
		<div className='space-y-8'>
			<div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Календар подій (UTC)
					</h1>
				</div>

				<div className='flex flex-wrap gap-3'>
					<Button
						type='button'
						variant='secondary'
						onClick={() => setCursor(new Date(Date.UTC(year, month - 1, 1)))}
					>
						<ChevronLeft
							className='h-4 w-4'
							aria-hidden
						/>
						Минулий місяць
					</Button>
					<Button
						type='button'
						variant='secondary'
						onClick={() => setCursor(new Date(Date.UTC(year, month + 1, 1)))}
					>
						Наступний місяць
						<ChevronRight
							className='h-4 w-4'
							aria-hidden
						/>
					</Button>
				</div>
			</div>

			<Card className='p-0'>
				<div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
					<h2 className='text-xl font-semibold capitalize text-gray-900'>
						{heading}
					</h2>
					<Badge className='bg-purple-50 text-purple-700'>
						{data?.totalCount ?? 0} загалом
					</Badge>
				</div>

				<div className='overflow-x-auto'>
					<div className='min-w-195 p-6'>
						<div className='grid grid-cols-7 gap-px bg-gray-200 text-center text-xs font-semibold uppercase text-gray-600'>
							{weekdayLabels.map(d => (
								<div
									key={d}
									className='bg-gray-50 py-3'
								>
									{d}
								</div>
							))}
						</div>

						<div className='grid grid-cols-7 gap-px bg-gray-200'>
							{grid.flat().map((cell, idx) =>
								cell ? (
									<div
										key={`${cell.day}-${idx}`}
										className='flex min-h-32 flex-col gap-2 bg-white p-2 align-top text-left text-sm'
									>
										<span className='text-xs font-semibold text-gray-500'>
											{cell.day}
										</span>
										<div className='space-y-2'>
											{(
												byDay.get(
													`${year}-${pad(month + 1)}-${pad(cell.day)}`
												) ?? []
											).map(ev => (
												<Link
													key={ev.id}
													href={`/events?open=${ev.id}`}
													className='block rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-xs font-medium text-purple-900 transition hover:border-purple-300'
												>
													<p className='line-clamp-2 leading-snug'>
														{ev.title}
													</p>
													<p className='mt-1 text-[10px] text-purple-700'>
														{formatDateTimeUtc(ev.date)}
													</p>
												</Link>
											))}
										</div>
									</div>
								) : (
									<div
										key={`blank-${idx}`}
										className='min-h-32 bg-gray-50'
									/>
								)
							)}
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
