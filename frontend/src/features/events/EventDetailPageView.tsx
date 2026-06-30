'use client'

import { Badge, RegistrationBadge } from '@/components/core/Badge/Badge'
import { Button } from '@/components/core/Button/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/core/Card/Card'
import { Loader } from '@/components/core/Loader/Loader'
import { useAuthModal } from '@/contexts/authModalContext'
import { useAuth } from '@/contexts/authContext'
import { EditEventModal } from '@/features/events/components/EditEventModal'
import {
	categoryLabel,
	formatLabel
} from '@/features/events/labels/eventDisplay'
import { formatDateTimeUtc } from '@/lib/datetime'
import { downloadEventIcs, getGoogleCalendarUrl } from '@/lib/calendarExport'
import { extractApiMessage } from '@/lib/apiError'
import { isAdminUser } from '@/lib/auth/isAdmin'
import { cn } from '@/lib/utils'
import { useCreateRegistration } from '@/queries/useCreateRegistration'
import { useDeleteEvent } from '@/queries/useDeleteEvent'
import { useEvent } from '@/queries/useEvent'
import { useRegistrations } from '@/queries/useRegistrations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	ArrowLeft,
	CalendarClock,
	CalendarDays,
	CalendarPlus,
	MapPin,
	Pencil,
	ShieldUser,
	Trash2,
	Users
} from 'lucide-react'
import { useMemo, useState } from 'react'

const linkButtonSecondary =
	'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-900 transition hover:bg-gray-50'

type Props = {
	eventId: string
}

export const EventDetailPageView = ({ eventId }: Props) => {
	const router = useRouter()
	const auth = useAuth()
	const { openLogin } = useAuthModal()
	const [editOpen, setEditOpen] = useState(false)
	const { data, isLoading, error } = useEvent(eventId)
	const deleteEventMut = useDeleteEvent()
	const { data: regPage, isLoading: regsLoading } = useRegistrations({
		pageNumber: 1,
		pageSize: 200
	})

	const myRegistration = useMemo(
		() => regPage?.items.find(r => r.eventId === eventId),
		[regPage?.items, eventId]
	)

	const {
		mutateAsync: registerMutate,
		reset: resetReg,
		isPending: regPending,
		isError: regIsError,
		error: regError
	} = useCreateRegistration()

	const eventTime = data ? new Date(data.date).getTime() : 0
	const graceMs = 60 * 60 * 1000
	const canRegister = Boolean(data && eventTime >= Date.now() - graceMs)

	const handleRegister = async () => {
		if (!data) return
		resetReg()
		if (!auth.isAuthenticated) {
			openLogin(`/events/${data.id}`)
			return
		}
		try {
			await registerMutate(data.id)
		} catch {}
	}

	const isPast = Boolean(data && eventTime < Date.now())

	const isAdmin = isAdminUser(auth.user?.role)
	const googleCalendarUrl = data ? getGoogleCalendarUrl(data) : '#'

	const handleDeleteEvent = async () => {
		if (!data) return
		if (!window.confirm('Видалити цю подію? Дію не можна скасувати.')) {
			return
		}
		try {
			await deleteEventMut.mutateAsync(data.id)
			router.push('/events')
		} catch {}
	}

	return (
		<div className='bg-gray-50'>
			<div className='mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-10'>
				<button
					type='button'
					onClick={() => router.back()}
					className='inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700 hover:cursor-pointer'
				>
					<ArrowLeft
						className='h-4 w-4'
						aria-hidden
					/>
					Назад
				</button>

				{isLoading ? (
					<Loader label='Завантаження події…' />
				) : error ? (
					<Card className='border-red-200 bg-red-50/40 p-6'>
						<p className='text-sm text-red-700'>
							{extractApiMessage(error, 'Подію не знайдено')}
						</p>
						<Link
							href='/events'
							className={cn(linkButtonSecondary, 'mt-4 w-fit')}
						>
							До каталогу
						</Link>
					</Card>
				) : data ? (
					<>
						{isAdmin ? (
							<div className='flex flex-wrap items-center gap-2 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm'>
								<span className='text-xs font-semibold uppercase tracking-wide text-violet-700'>
									Адмін
								</span>
								<Button
									type='button'
									variant='secondary'
									className='h-9 gap-2 px-4 text-sm'
									onClick={() => setEditOpen(true)}
								>
									<Pencil
										className='h-4 w-4'
										aria-hidden
									/>
									Редагувати
								</Button>
								<Button
									type='button'
									variant='secondary'
									className='h-9 gap-2 border-red-200 px-4 text-sm text-red-700 hover:bg-red-50'
									disabled={deleteEventMut.isPending}
									isLoading={deleteEventMut.isPending}
									loadingText='Видалення…'
									onClick={handleDeleteEvent}
								>
									<Trash2
										className='h-4 w-4'
										aria-hidden
									/>
									Видалити
								</Button>
								<Link
									href={`/admin/registrations?eventId=${data.id}`}
									className={cn(
										linkButtonSecondary,
										'h-9 px-4 text-sm font-medium text-violet-700 ring-1 ring-violet-100 hover:bg-violet-50'
									)}
								>
									Заявки на подію
								</Link>
							</div>
						) : null}

						{deleteEventMut.isError ? (
							<p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
								{extractApiMessage(
									deleteEventMut.error,
									'Не вдалося видалити подію.'
								)}
							</p>
						) : null}

						<div className='overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-slate-900 via-slate-800 to-violet-900 shadow-sm'>
							<div className='flex min-h-45 flex-col justify-end gap-2 p-6 text-white sm:min-h-55 sm:p-8'>
								<div className='flex flex-wrap gap-2'>
									<Badge className='border-0 bg-white/15 text-white backdrop-blur'>
										{isPast ? 'Завершена' : 'Активна'}
									</Badge>
									<Badge className='border-0 bg-white/15 text-white backdrop-blur'>
										<MapPin
											className='mr-1 inline h-3 w-3'
											aria-hidden
										/>
										{data.location}
									</Badge>
									<Badge className='border-0 bg-white/15 text-white backdrop-blur'>
										<Users
											className='mr-1 inline h-3 w-3'
											aria-hidden
										/>
										{data.approvedRegistrationCount ?? 0} / {data.capacity}{' '}
										учасників
									</Badge>
									<Badge className='border-0 bg-white/15 text-white backdrop-blur'>
										{categoryLabel(data.category)}
									</Badge>
									<Badge className='border-0 bg-white/15 text-white backdrop-blur'>
										{formatLabel(data.format)}
									</Badge>
								</div>
								<h1 className='text-2xl font-bold leading-tight sm:text-3xl'>
									{data.title}
								</h1>
								<p className='flex flex-wrap items-center gap-2 text-sm text-violet-100'>
									<CalendarDays
										className='h-4 w-4 shrink-0'
										aria-hidden
									/>
									{formatDateTimeUtc(data.date)}
								</p>
							</div>
						</div>

						<div className='grid gap-6 lg:grid-cols-3'>
							<div className='space-y-6 lg:col-span-2'>
								<Card className='rounded-2xl border-gray-200/80 p-6 shadow-sm'>
									<CardHeader className='mb-0 p-0'>
										<CardTitle className='text-xl'>Опис</CardTitle>
									</CardHeader>
									<CardContent className='mt-4 p-0'>
										<p className='whitespace-pre-wrap text-base leading-relaxed text-gray-700'>
											{data.description}
										</p>
									</CardContent>
								</Card>
							</div>

							<div className='space-y-6'>
								<Card className='rounded-2xl border-gray-200/80 p-6 shadow-sm'>
									<CardHeader className='mb-3 p-0'>
										<CardTitle className='text-lg'>Реєстрація</CardTitle>
										<CardDescription>
											{auth.isAuthenticated
												? 'Ваша заявка на цю подію.'
												: 'Увійдіть, щоб подати заявку на участь.'}
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4 p-0'>
										{regsLoading && auth.isAuthenticated ? (
											<p className='text-sm text-gray-500'>Перевірка заявок…</p>
										) : myRegistration ? (
											<div className='space-y-2'>
												<p className='text-sm font-medium text-gray-900'>
													Статус заявки
												</p>
												<RegistrationBadge status={myRegistration.status} />
											</div>
										) : (
											<p className='text-sm text-gray-600'>
												Ви ще не подавали заявку на цю подію.
											</p>
										)}

										{!canRegister ? (
											<p className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900'>
												Реєстрація на минулі події закрита.
											</p>
										) : null}

										{regIsError ? (
											<p className='text-sm text-red-600'>
												{extractApiMessage(regError)}
											</p>
										) : null}

										<Button
											type='button'
											className='w-full'
											disabled={
												!canRegister || regPending || Boolean(myRegistration)
											}
											isLoading={regPending}
											loadingText='Надсилання…'
											onClick={handleRegister}
										>
											{myRegistration ? 'Заявку вже подано' : 'Зареєструватися'}
										</Button>

										{!auth.isAuthenticated ? (
											<p className='text-center text-xs text-gray-500'>
												Натисніть кнопку вище — відкриється вікно входу.
											</p>
										) : null}
									</CardContent>
								</Card>

								<Card className='rounded-2xl border-gray-200/80 p-6 shadow-sm'>
									<CardHeader className='mb-2 p-0'>
										<CardTitle className='flex items-center gap-2 text-lg'>
											<ShieldUser
												className='h-5 w-5 text-violet-600'
												aria-hidden
											/>
											Організатор
										</CardTitle>
									</CardHeader>
									<CardContent className='p-0'>
										<p className='text-sm text-gray-600'>
											Команда Eventify допомагає з організацією та збором заявок
											на цю подію.
										</p>
										<p className='mt-3 text-xs text-gray-400'>
											Платформа: Eventify · створено{' '}
											{formatDateTimeUtc(data.createdAt)}
										</p>
									</CardContent>
								</Card>

								<Card className='rounded-2xl border-gray-200/80 p-6 shadow-sm'>
									<CardHeader className='mb-3 p-0'>
										<CardTitle className='flex items-center gap-2 text-lg'>
											<CalendarPlus
												className='h-5 w-5 text-violet-600'
												aria-hidden
											/>
											Календар
										</CardTitle>
										<CardDescription>
											Збережіть подію, щоб не пропустити дату й час.
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-3 p-0'>
										<Button
											type='button'
											variant='secondary'
											className='w-full justify-center'
											onClick={() => downloadEventIcs(data)}
										>
											<CalendarPlus
												className='h-4 w-4'
												aria-hidden
											/>
											Завантажити .ics
										</Button>
										<Link
											href={googleCalendarUrl}
											target='_blank'
											rel='noreferrer'
											className={cn(
												linkButtonSecondary,
												'w-full border-violet-100 text-violet-700 hover:bg-violet-50'
											)}
										>
											Додати в Google Calendar
										</Link>
									</CardContent>
								</Card>
							</div>
						</div>

						<div className='flex justify-center'>
							<Link
								href='/events'
								className={cn(linkButtonSecondary)}
							>
								<CalendarClock
									className='h-4 w-4'
									aria-hidden
								/>
								Інші події
							</Link>
						</div>

						<EditEventModal
							isOpen={editOpen}
							event={data}
							onClose={() => setEditOpen(false)}
						/>
					</>
				) : null}
			</div>
		</div>
	)
}
