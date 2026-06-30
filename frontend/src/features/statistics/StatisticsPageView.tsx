'use client'

import { Card } from '@/components/core/Card/Card'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { Skeleton } from '@/components/core/Skeleton/Skeleton'
import { formatMonthYear } from '@/lib/datetime'
import type { EventDto } from '@/types/api'
import { useEvents } from '@/queries/useEvents'
import { BarChart3 } from 'lucide-react'
import { useMemo } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

const groupByMonthUtc = (events: EventDto[]) => {
	const map = new Map<string, number>()
	for (const e of events) {
		const d = new Date(e.date)
		const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
			2,
			'0'
		)}`
		map.set(key, (map.get(key) ?? 0) + 1)
	}
	return [...map.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, eventsCount]) => {
			const [y, m] = key.split('-').map(Number)
			const label = formatMonthYear(new Date(Date.UTC(y, m - 1, 1)))
			return { key, label, events: eventsCount }
		})
}

export const StatisticsPageView = () => {
	const params = useMemo(
		() => ({
			pageNumber: 1,
			pageSize: 100,
			sortBy: 'date',
			sortOrder: 'desc' as const
		}),
		[]
	)

	const { data, isLoading, error } = useEvents(params)

	const chartRows = useMemo(() => groupByMonthUtc(data?.items ?? []), [data])

	const avgCapacity = data?.items?.length
		? data.items.reduce((acc, cur) => acc + cur.capacity, 0) / data.items.length
		: 0

	if (error) {
		return (
			<p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
				Не вдалося побудувати аналітику. Перевірте з’єднання або спробуйте
				пізніше.
			</p>
		)
	}

	if (isLoading) {
		return (
			<div className='space-y-8'>
				<div className='grid gap-4 md:grid-cols-3'>
					<Skeleton className='h-28 rounded-xl' />
					<Skeleton className='h-28 rounded-xl' />
					<Skeleton className='h-28 rounded-xl' />
				</div>
				<Skeleton className='h-96 rounded-xl' />
			</div>
		)
	}

	const items = data?.items ?? []
	if (!items.length) {
		return (
			<EmptyState
				icon={BarChart3}
				title='Бракує даних'
				description='Щоб отримувати статистику, дочекайтесь першого набору подій у системі.'
			/>
		)
	}

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Аналітика подій</h1>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<p className='text-sm text-purple-600'>Подій загалом</p>
					<p className='mt-2 text-3xl font-semibold text-gray-900'>
						{data?.totalCount ?? items.length}
					</p>
				</Card>
				<Card>
					<p className='text-sm text-blue-500'>У вибірці</p>
					<p className='mt-2 text-3xl font-semibold text-gray-900'>
						{items.length}
					</p>
				</Card>
				<Card>
					<p className='text-sm text-green-600'>Середня місткість у вибірці</p>
					<p className='mt-2 text-3xl font-semibold text-gray-900'>
						{avgCapacity.toFixed(1)}
					</p>
				</Card>
			</div>

			<Card className='p-0'>
				<div className='border-b border-gray-200 px-6 py-4'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Події по місяцях (UTC)
					</h2>
					<p className='text-sm text-gray-500'>
						Розподіл кількості стартів подій усередині поточної вибірки.
					</p>
				</div>
				<div className='h-105 px-4 py-6 sm:px-6'>
					{chartRows.length ? (
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<BarChart data={chartRows}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='#f1f5f9'
								/>
								<XAxis
									dataKey='label'
									tick={{ fontSize: 12, fill: '#64748b' }}
								/>
								<YAxis
									allowDecimals={false}
									tick={{ fontSize: 12, fill: '#64748b' }}
								/>
								<Tooltip cursor={{ fill: '#faf5ff' }} />
								<Bar
									dataKey='events'
									fill='#7c3aed'
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p className='text-center text-sm text-gray-500'>
							Дані для діаграми недоступні.
						</p>
					)}
				</div>
			</Card>
		</div>
	)
}
