'use client'

import { Button } from '@/components/core/Button/Button'
import { Card } from '@/components/core/Card/Card'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { Loader } from '@/components/core/Loader/Loader'
import { RegistrationBadge } from '@/components/core/Badge/Badge'
import { useAuth } from '@/contexts/authContext'
import { useAuthModal } from '@/contexts/authModalContext'
import { isAdminUser } from '@/lib/auth/isAdmin'
import { CreateEventModal } from '@/features/events/components/CreateEventModal'
import { EventStatHeroCards } from '@/features/dashboard/EventStatHeroCards'
import { useHomePageDashboard } from '@/features/home/hooks/useHomePageDashboard'
import { formatDateTimeUtc } from '@/lib/datetime'
import { initialsFromUsername } from '@/lib/initialsFromUsername'
import {
	CalendarPlus,
	CalendarDays,
	CalendarX,
	ChevronRight,
	ClipboardList,
	LogIn,
	MapPin,
	Plus
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const HomePageView = () => {
	const router = useRouter()
	const auth = useAuth()
	const { openLogin } = useAuthModal()
	const {
		aggregate,
		aggregateLoading,
		registrationStats,
		heroEvents,
		recentRegs,
		regLoading,
		isAuthenticated,
		isHydrated
	} = useHomePageDashboard()

	const [createOpen, setCreateOpen] = useState(false)

	return (
		<div className='bg-gray-50'>
			<div className='mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-10'>
				<EventStatHeroCards
					items={aggregate?.items ?? []}
					totalEvents={aggregate?.totalCount}
					isLoadingEvents={aggregateLoading}
					registrations={registrationStats}
				/>

				<div className='grid gap-8 lg:grid-cols-12 lg:items-start'>
					<section className='space-y-4 lg:col-span-7'>
						<div className='flex flex-wrap items-end justify-between gap-3'>
							<h2 className='text-xl font-semibold text-gray-900'>
								Майбутні заходи
							</h2>
							<Link
								href='/events'
								className='text-sm font-semibold text-violet-600 hover:text-violet-700'
							>
								Переглянути всі
							</Link>
						</div>

						<Card className='space-y-3 rounded-2xl border-gray-200/80 p-4 shadow-sm sm:p-5'>
							{aggregateLoading ? (
								<Loader label='Завантаження…' />
							) : heroEvents.length === 0 ? (
								<EmptyState
									icon={CalendarX}
									title='Немає майбутніх заходів'
									description='Спробуйте переглянути повний каталог подій.'
									action={
										<Button
											type='button'
											onClick={() => router.push('/events')}
										>
											До каталогу
										</Button>
									}
								/>
							) : (
								<ul className='space-y-3'>
									{heroEvents.map(event => (
										<li key={event.id}>
											<Link
												href={`/events/${event.id}`}
												className='group flex w-full gap-4 rounded-2xl border border-transparent bg-gray-50/80 p-3 text-left transition hover:border-violet-200 hover:bg-white hover:shadow-sm'
											>
												<div className='relative h-18 w-28 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-slate-900 via-slate-800 to-violet-900 shadow-inner'>
													<span className='absolute inset-0 flex items-end p-2 text-[11px] font-semibold leading-tight text-white'>
														<span className='line-clamp-3'>{event.title}</span>
													</span>
												</div>
												<div className='min-w-0 flex-1 py-0.5'>
													<p className='font-semibold text-gray-900 group-hover:text-violet-700'>
														{event.title}
													</p>
													<p className='mt-1 flex items-center gap-1.5 text-xs text-gray-500'>
														<CalendarDays
															className='h-3.5 w-3.5 shrink-0 text-violet-500'
															aria-hidden
														/>
														{formatDateTimeUtc(event.date)}
													</p>
													<p className='mt-0.5 flex items-center gap-1.5 text-xs text-gray-500'>
														<MapPin
															className='h-3.5 w-3.5 shrink-0 text-blue-500'
															aria-hidden
														/>
														{event.location}
													</p>
												</div>
												<div className='hidden shrink-0 self-center sm:block'>
													<span className='inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800'>
														до {event.capacity} місць
													</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							)}
						</Card>

						<div className='flex justify-center pt-1'>
							<Link
								href='/events'
								className='inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700'
							>
								Переглянути всі заходи
								<ChevronRight
									className='h-4 w-4'
									aria-hidden
								/>
							</Link>
						</div>
					</section>

					<section className='space-y-4 lg:col-span-5'>
						<div className='flex flex-wrap items-end justify-between gap-3'>
							<h2 className='text-xl font-semibold text-gray-900'>
								Останні заявки
							</h2>
							{isAuthenticated ? (
								<Link
									href='/registrations'
									className='text-sm font-semibold text-violet-600 hover:text-violet-700'
								>
									Переглянути всі
								</Link>
							) : null}
						</div>

						<Card className='overflow-hidden rounded-2xl border-gray-200/80 p-0 shadow-sm'>
							{!isHydrated || (isAuthenticated && regLoading) ? (
								<div className='p-8'>
									<Loader label='Завантаження заявок…' />
								</div>
							) : !isAuthenticated ? (
								<div className='p-8'>
									<EmptyState
										icon={LogIn}
										title='Увійдіть, щоб бачити заявки'
										description='Після входу тут з’явиться таблиця ваших останніх реєстрацій.'
										action={
											<Button
												type='button'
												onClick={() => openLogin('/')}
											>
												Увійти
											</Button>
										}
									/>
								</div>
							) : recentRegs.length === 0 ? (
								<div className='p-8'>
									<EmptyState
										icon={ClipboardList}
										title='Ще немає заявок'
										description='Оберіть захід у каталозі та зареєструйтеся.'
										action={
											<Button
												type='button'
												variant='secondary'
												onClick={() => router.push('/events')}
											>
												До заходів
											</Button>
										}
									/>
								</div>
							) : (
								<div className='overflow-x-auto'>
									<table className='w-full min-w-[320px] text-left text-sm'>
										<thead>
											<tr className='border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500'>
												<th className='px-4 py-3'>Ім&apos;я</th>
												<th className='px-4 py-3'>Захід</th>
												<th className='px-4 py-3'>Статус</th>
												<th className='hidden px-4 py-3 sm:table-cell'>Дата</th>
											</tr>
										</thead>
										<tbody className='divide-y divide-gray-100'>
											{recentRegs.map(row => (
												<tr
													key={row.id}
													className='bg-white'
												>
													<td className='px-4 py-3'>
														<div className='flex items-center gap-2'>
															<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800'>
																{initialsFromUsername(row.username)}
															</span>
															<span className='font-medium text-gray-900'>
																{row.username}
															</span>
														</div>
													</td>
													<td className='max-w-35 truncate px-4 py-3 text-gray-600'>
														<Link
															href={`/events/${row.eventId}`}
															className='font-medium text-violet-700 hover:underline'
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
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</Card>

						{isAuthenticated ? (
							<div className='flex justify-center pt-1'>
								<Link
									href='/registrations'
									className='inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700'
								>
									Переглянути всі заявки
									<ChevronRight
										className='h-4 w-4'
										aria-hidden
									/>
								</Link>
							</div>
						) : null}
					</section>
				</div>
			</div>

			{isAuthenticated && isAdminUser(auth.user?.role) ? (
				<section className='border-t border-violet-100 bg-linear-to-r from-violet-100/80 via-violet-50 to-indigo-50'>
					<div className='mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10'>
						<div className='flex gap-4'>
							<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>
								<CalendarPlus
									className='h-7 w-7'
									aria-hidden
								/>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Створіть новий захід
								</h3>
								<p className='mt-1 max-w-xl text-sm text-gray-600'>
									Організуйте подію, зберіть заявки та стежте за статистикою —
									усе в одному кабінеті Eventify.
								</p>
							</div>
						</div>
						<Button
							type='button'
							className='h-12 shrink-0 rounded-2xl px-6 text-base shadow-md shadow-violet-500/20'
							onClick={() => setCreateOpen(true)}
						>
							<Plus
								className='h-5 w-5'
								aria-hidden
							/>
							Створити захід
						</Button>
					</div>
				</section>
			) : null}

			<CreateEventModal
				isOpen={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
		</div>
	)
}
