'use client'

import { RegistrationBadge } from '@/components/core/Badge/Badge'
import { Card } from '@/components/core/Card/Card'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { Skeleton } from '@/components/core/Skeleton/Skeleton'
import { EventsPagination } from '@/features/events/components/EventsPagination'
import { extractApiMessage } from '@/lib/apiError'
import { formatDateTimeUtc } from '@/lib/datetime'
import { useRegistrations } from '@/queries/useRegistrations'
import Link from 'next/link'
import { CalendarRange } from 'lucide-react'
import { useState } from 'react'

export const RegistrationsPageView = () => {
	const [page, setPage] = useState(1)

	const { data, isLoading, error, refetch } = useRegistrations({
		pageNumber: page,
		pageSize: 8,
		sortOrder: 'desc',
		sortBy: 'createdat'
	})

	if (error) {
		return (
			<p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
				Не вдалося завантажити ваші реєстрації ({extractApiMessage(error)}).
				<button
					className='mt-3 block font-semibold text-purple-700 underline'
					onClick={() => refetch()}
					type='button'
				>
					Повторити
				</button>
			</p>
		)
	}

	if (isLoading) {
		return (
			<div className='space-y-8'>
				<Skeleton className='h-10 w-72 rounded-xl' />
				<div className='space-y-3'>
					{[0, 1, 2, 3].map(key => (
						<Skeleton
							key={key}
							className='h-24 rounded-xl'
						/>
					))}
				</div>
			</div>
		)
	}

	const rows = data?.items ?? []

	if (!rows.length) {
		return (
			<>
				<header className='space-y-2'>
					<h1 className='text-3xl font-bold text-gray-900'>Мої реєстрації</h1>
					<p className='text-gray-500'>
						Заявки, які ви створили через кнопку «Зареєструватися» у картках
						подій.
					</p>
				</header>
				<EmptyState
					icon={CalendarRange}
					title='Поки що порожньо'
					description='Оберіть подію й надішліть заявку — тут з’являться статус Pending / Approved / Rejected.'
					action={<Link href='/events'>На події</Link>}
				/>
			</>
		)
	}

	return (
		<div className='space-y-10'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Мої реєстрації</h1>
				<p className='mt-2 max-w-2xl text-gray-500'>
					Швидкий огляд усіх заявок. Команда модерації оновлює статус.
				</p>
			</div>

			<div className='hidden lg:block'>
				<Card className='overflow-hidden p-0'>
					<table className='min-w-full divide-y divide-gray-200 text-sm'>
						<thead className='bg-gray-50 text-left'>
							<tr>
								<th className='px-6 py-3 font-semibold text-gray-500'>Подія</th>
								<th className='px-6 py-3 font-semibold text-gray-500'>
									Статус
								</th>
								<th className='px-6 py-3 font-semibold text-gray-500'>
									Подано
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200 bg-white'>
							{rows.map(item => (
								<tr
									key={item.id}
									className='hover:bg-purple-50/40'
								>
									<td className='px-6 py-4'>
										<Link
											href={`/events?open=${item.eventId}`}
											className='font-semibold text-purple-700 hover:text-purple-800'
										>
											{item.eventTitle}
										</Link>
										<p className='text-xs text-gray-500'>@{item.username}</p>
									</td>
									<td className='px-6 py-4'>
										<RegistrationBadge status={item.status} />
									</td>
									<td className='px-6 py-4 text-gray-600'>
										{formatDateTimeUtc(item.createdAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Card>
			</div>

			<div className='space-y-3 lg:hidden'>
				{rows.map(item => (
					<Card key={item.id}>
						<div className='flex flex-wrap items-center justify-between gap-3'>
							<div>
								<p className='text-xs font-semibold uppercase text-gray-500'>
									Подія
								</p>
								<Link
									href={`/events?open=${item.eventId}`}
									className='mt-1 text-lg font-semibold text-purple-700'
								>
									{item.eventTitle}
								</Link>
							</div>
							<RegistrationBadge status={item.status} />
						</div>
						<p className='mt-4 text-xs text-gray-500'>
							Подано: {formatDateTimeUtc(item.createdAt)}
						</p>
					</Card>
				))}
			</div>

			<EventsPagination
				page={data?.pageNumber ?? page}
				totalPages={data?.totalPages ?? 1}
				onPrev={() => setPage(p => Math.max(1, p - 1))}
				onNext={() =>
					setPage(p =>
						data?.totalPages ? Math.min(data.totalPages, p + 1) : p + 1
					)
				}
			/>
		</div>
	)
}
