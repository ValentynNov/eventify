'use client'

import { Badge } from '@/components/core/Badge/Badge'
import { Button } from '@/components/core/Button/Button'
import { Card } from '@/components/core/Card/Card'
import { Loader } from '@/components/core/Loader/Loader'
import { RegistrationBadge } from '@/components/core/Badge/Badge'
import { formatDateTimeUtc } from '@/lib/datetime'
import { extractApiMessage } from '@/lib/apiError'
import { useAdminRegistrations } from '@/queries/useAdminRegistrations'
import { usePatchRegistrationStatus } from '@/queries/usePatchRegistrationStatus'
import type { RegistrationStatusDto } from '@/types/api'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const AdminRegistrationsPageView = () => {
	const [page, setPage] = useState(1)
	const pageSize = 15
	const searchParams = useSearchParams()
	const eventIdFilter = searchParams.get('eventId') ?? undefined

	useEffect(() => {
		setPage(1)
	}, [eventIdFilter])

	const { data, isLoading, error, refetch } = useAdminRegistrations({
		pageNumber: page,
		pageSize,
		...(eventIdFilter ? { eventId: eventIdFilter } : {})
	})

	const { mutateAsync: patchStatus, isPending } = usePatchRegistrationStatus()

	const act = async (id: string, status: RegistrationStatusDto) => {
		try {
			await patchStatus({ registrationId: id, status })
		} catch {
			/* surfaced via query */
		}
	}

	return (
		<div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10'>
			<header className='mb-8 space-y-2'>
				<h1 className='text-3xl font-bold text-gray-900'>Модерація заявок</h1>
				{eventIdFilter ? (
					<p className='text-sm text-gray-600'>
						Фільтр: заявки на обрану подію.{' '}
						<Link
							href='/admin/registrations'
							className='font-semibold text-purple-600 hover:underline'
						>
							Показати всі
						</Link>
					</p>
				) : null}
				<p className='max-w-2xl text-gray-600'>
					Переглядайте всі реєстрації на події та підтверджуйте або відхиляйте
					заявки учасників.
				</p>
				<p className='text-sm text-gray-500'>
					Повернутися до{' '}
					<Link href='/' className='font-semibold text-purple-600 hover:underline'>
						головної
					</Link>{' '}
					або{' '}
					<Link href='/events' className='font-semibold text-purple-600 hover:underline'>
						каталогу подій
					</Link>
					.
				</p>
			</header>

			<Card className='overflow-hidden rounded-2xl border-gray-200/80 p-0 shadow-sm'>
				{isLoading ? (
					<div className='p-12'>
						<Loader label='Завантаження заявок…' />
					</div>
				) : error ? (
					<div className='p-8'>
						<p className='text-sm text-red-600'>
							{extractApiMessage(error, 'Не вдалося завантажити дані')}
						</p>
						<Button type='button' className='mt-4' onClick={() => refetch()}>
							Оновити
						</Button>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[720px] text-left text-sm'>
							<thead>
								<tr className='border-b border-gray-200 bg-gray-50/90 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									<th className='px-4 py-3'>Користувач</th>
									<th className='px-4 py-3'>Подія</th>
									<th className='px-4 py-3'>Статус</th>
									<th className='hidden px-4 py-3 sm:table-cell'>Дата</th>
									<th className='px-4 py-3 text-right'>Дії</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-100'>
								{data?.items.map((row) => (
									<tr key={row.id} className='bg-white'>
										<td className='px-4 py-3 font-medium text-gray-900'>
											{row.username}
										</td>
										<td className='max-w-[200px] px-4 py-3'>
											<Link
												href={`/events/${row.eventId}`}
												className='truncate font-medium text-violet-700 hover:underline'
											>
												{row.eventTitle}
											</Link>
										</td>
										<td className='px-4 py-3'>
											<RegistrationBadge status={row.status} />
										</td>
										<td className='hidden whitespace-nowrap px-4 py-3 text-gray-500 sm:table-cell'>
											{formatDateTimeUtc(row.createdAt)}
										</td>
										<td className='px-4 py-3'>
											<div className='flex flex-wrap justify-end gap-2'>
												<Button
													type='button'
													variant='secondary'
													className='h-9 px-3 text-xs'
													disabled={isPending || row.status === 'Approved'}
													onClick={() => act(row.id, 'Approved')}
												>
													Схвалити
												</Button>
												<Button
													type='button'
													variant='secondary'
													className='h-9 border-red-200 px-3 text-xs text-red-700 hover:border-red-300 hover:bg-red-50'
													disabled={isPending || row.status === 'Rejected'}
													onClick={() => act(row.id, 'Rejected')}
												>
													Відхилити
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			{data && data.totalPages > 1 ? (
				<div className='mt-6 flex items-center justify-center gap-4'>
					<Button
						type='button'
						variant='secondary'
						disabled={page <= 1}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						Назад
					</Button>
					<Badge>
						Сторінка {page} з {data.totalPages}
					</Badge>
					<Button
						type='button'
						variant='secondary'
						disabled={page >= data.totalPages}
						onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
					>
						Далі
					</Button>
				</div>
			) : null}
		</div>
	)
}
