'use client'

import { Badge, RegistrationBadge } from '@/components/core/Badge/Badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/core/Card/Card'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { Input } from '@/components/core/Input/Input'
import { Loader } from '@/components/core/Loader/Loader'
import { useAuth } from '@/contexts/authContext'
import { categoryLabel } from '@/features/events/labels/eventDisplay'
import { extractApiMessage } from '@/lib/apiError'
import { formatDateTimeUtc } from '@/lib/datetime'
import { initialsFromUsername } from '@/lib/initialsFromUsername'
import { useRegistrationStreak } from '@/queries/useRegistrationStreak'
import { useRegistrations } from '@/queries/useRegistrations'
import type { RegistrationDto } from '@/types/api'
import {
	Award,
	BadgeCheck,
	CalendarCheck2,
	Flame,
	Sparkles,
	Trophy,
	UserRound
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Achievement = {
	id: string
	title: string
	description: string
	unlocked: boolean
	icon: typeof Award
}

const getAvatarStorageKey = (email: string | undefined): string =>
	`eventify_avatar_emoji:${email ?? 'guest'}`

const getFirstGrapheme = (value: string): string => {
	const trimmed = value.trim()
	if (!trimmed) return ''
	const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
	return segmenter.segment(trimmed)[Symbol.iterator]().next().value?.segment ?? ''
}

const isEmoji = (value: string): boolean =>
	/\p{Extended_Pictographic}/u.test(value)

const countStatuses = (items: RegistrationDto[]) => ({
	total: items.length,
	pending: items.filter(item => item.status === 'Pending').length,
	approved: items.filter(item => item.status === 'Approved').length,
	rejected: items.filter(item => item.status === 'Rejected').length
})

export const ProfilePageView = () => {
	const { user } = useAuth()
	const [avatarEmoji, setAvatarEmoji] = useState<string | null>(null)
	const [avatarDraft, setAvatarDraft] = useState('')
	const [avatarError, setAvatarError] = useState('')
	const registrations = useRegistrations({
		pageNumber: 1,
		pageSize: 100,
		sortBy: 'createdat',
		sortOrder: 'desc'
	})
	const streak = useRegistrationStreak()
	const avatarStorageKey = getAvatarStorageKey(user?.email)

	useEffect(() => {
		if (!user?.email) return
		const stored = window.localStorage.getItem(avatarStorageKey)
		setAvatarEmoji(stored)
		setAvatarDraft('')
		setAvatarError('')
	}, [avatarStorageKey, user?.email])

	const selectAvatarEmoji = () => {
		if (avatarEmoji) return
		const emoji = getFirstGrapheme(avatarDraft)
		if (!emoji || !isEmoji(emoji)) {
			setAvatarError('Вставте один емодзі')
			return
		}
		setAvatarEmoji(emoji)
		window.localStorage.setItem(avatarStorageKey, emoji)
		setAvatarDraft('')
		setAvatarError('')
	}

	const rows = registrations.data?.items ?? []
	const stats = useMemo(() => countStatuses(rows), [rows])
	const favoriteCategories = useMemo(() => {
		const counts = new Map<string, number>()
		rows.forEach(row => {
			const category = row.eventCategory
			if (category) counts.set(category, (counts.get(category) ?? 0) + 1)
		})

		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
	}, [rows])

	const achievements = useMemo<Achievement[]>(() => {
		const days = streak.data?.days ?? 0
		return [
			{
				id: 'first-registration',
				title: 'Перший крок',
				description: 'Подати першу заявку на подію.',
				unlocked: stats.total >= 1,
				icon: CalendarCheck2
			},
			{
				id: 'approved-member',
				title: 'Учасник комʼюніті',
				description: 'Отримати першу схвалену заявку.',
				unlocked: stats.approved >= 1,
				icon: BadgeCheck
			},
			{
				id: 'streak-3',
				title: 'Гаряча серія',
				description: 'Реєструватися 3 дні поспіль.',
				unlocked: days >= 3,
				icon: Flame
			},
			{
				id: 'regular-guest',
				title: 'Постійний гість',
				description: 'Отримати 3 схвалені заявки на події.',
				unlocked: stats.approved >= 3,
				icon: Trophy
			},
			{
				id: 'event-collector',
				title: 'Колекціонер подій',
				description: 'Подати заявки на 5 різних подій.',
				unlocked: stats.total >= 5,
				icon: Award
			},
			{
				id: 'category-explorer',
				title: 'Дослідник форматів',
				description: 'Відвідати події щонайменше у 3 категоріях.',
				unlocked: favoriteCategories.length >= 3 && stats.approved >= 3,
				icon: Sparkles
			}
		]
	}, [favoriteCategories.length, stats.approved, stats.total, streak.data?.days])

	if (registrations.isLoading || streak.isLoading) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<Loader label='Завантаження профілю…' />
			</div>
		)
	}

	if (registrations.error) {
		return (
			<div className='mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10'>
				<p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
					{extractApiMessage(registrations.error, 'Не вдалося завантажити профіль')}
				</p>
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-10'>
			<section className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
				<div className='bg-linear-to-br from-gray-950 via-slate-800 to-violet-900 px-6 py-8 text-white sm:px-8'>
					<div className='flex flex-wrap items-center gap-5'>
						<div className='flex h-18 w-18 items-center justify-center rounded-2xl bg-white/12 text-3xl font-bold ring-1 ring-white/20'>
							{avatarEmoji ?? initialsFromUsername(user?.username ?? '')}
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm text-violet-100'>Профіль Eventify</p>
							<h1 className='truncate text-3xl font-bold'>{user?.username}</h1>
							<p className='mt-1 text-sm text-gray-300'>{user?.email}</p>
							{avatarEmoji ? (
								<p className='mt-4 inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-violet-100 ring-1 ring-white/15'>
									Аватар обрано назавжди
								</p>
							) : (
								<div className='mt-4 flex max-w-md flex-col gap-2 sm:flex-row'>
									<Input
										value={avatarDraft}
										onChange={event => {
											setAvatarDraft(getFirstGrapheme(event.target.value))
											setAvatarError('')
										}}
										placeholder='Вставте будь-який емодзі'
										className='h-10 rounded-lg bg-white/95 py-2 text-center text-lg'
										error={avatarError}
										aria-label='Емодзі аватарки'
									/>
									<button
										type='button'
										onClick={selectAvatarEmoji}
										className='h-10 shrink-0 rounded-lg bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-violet-50 disabled:opacity-50'
										disabled={!avatarDraft.trim()}
									>
										Обрати
									</button>
								</div>
							)}
						</div>
						<Badge className='ml-auto border-0 bg-white/15 px-4 py-1.5 text-white'>
							<UserRound className='mr-1.5 h-4 w-4' aria-hidden />
							{user?.role}
						</Badge>
					</div>
				</div>
				<div className='grid gap-px bg-gray-200 sm:grid-cols-4'>
					<StatCell label='Реєстрацій' value={stats.total} />
					<StatCell label='Схвалено' value={stats.approved} />
					<StatCell label='Очікує' value={stats.pending} />
					<StatCell
						label='Streak'
						value={streak.data?.days ? `🔥 ${streak.data.days}` : 0}
					/>
				</div>
			</section>

			<div className='grid gap-6 lg:grid-cols-3'>
				<Card className='lg:col-span-2'>
					<CardHeader>
						<div>
							<CardTitle>Останні заявки</CardTitle>
							<CardDescription>
								Найсвіжіші подані заявки та їхній статус.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						{rows.length ? (
							<div className='space-y-3'>
								{rows.slice(0, 5).map(item => (
									<Link
										key={item.id}
										href={`/events/${item.eventId}`}
										className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3 transition hover:border-violet-100 hover:bg-violet-50/50'
									>
										<div>
											<p className='font-semibold text-gray-900'>
												{item.eventTitle}
											</p>
											<p className='text-xs text-gray-500'>
												{formatDateTimeUtc(item.createdAt)}
											</p>
										</div>
										<RegistrationBadge status={item.status} />
									</Link>
								))}
							</div>
						) : (
							<EmptyState
								icon={CalendarCheck2}
								title='Заявок ще немає'
								description='Оберіть подію й подайте заявку, щоб тут зʼявилася активність.'
								action={<Link href='/events'>Перейти до подій</Link>}
								className='py-10'
							/>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Улюблені категорії</CardTitle>
							<CardDescription>
								Рахуються за подіями, на які ви подавали заявки.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						{favoriteCategories.length ? (
							<div className='space-y-3'>
								{favoriteCategories.map(([category, count]) => (
									<div
										key={category}
										className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'
									>
										<span className='font-medium text-gray-900'>
											{categoryLabel(category)}
										</span>
										<Badge>{count}</Badge>
									</div>
								))}
							</div>
						) : (
							<p className='text-sm text-gray-500'>
								Категорії зʼявляться після заявок на події з каталогу.
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div>
						<CardTitle>Ачівки</CardTitle>
						<CardDescription>
							Мотиваційні бейджі для заявок, streak і активності.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{achievements.map(achievement => (
							<AchievementCard key={achievement.id} achievement={achievement} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

const StatCell = ({ label, value }: { label: string; value: number | string }) => (
	<div className='bg-white px-5 py-4'>
		<p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
			{label}
		</p>
		<p className='mt-1 text-2xl font-bold text-gray-900'>{value}</p>
	</div>
)

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
	const Icon = achievement.icon

	return (
		<div
			className={`rounded-xl border p-4 transition ${
				achievement.unlocked
					? 'border-violet-100 bg-violet-50/70'
					: 'border-gray-200 bg-gray-50 opacity-75'
			}`}
		>
			<div className='flex items-start gap-3'>
				<div
					className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
						achievement.unlocked
							? 'bg-violet-600 text-white'
							: 'bg-white text-gray-400'
					}`}
				>
					<Icon className='h-5 w-5' aria-hidden />
				</div>
				<div>
					<p className='font-semibold text-gray-900'>{achievement.title}</p>
					<p className='mt-1 text-sm text-gray-500'>{achievement.description}</p>
					<p
						className={`mt-3 text-xs font-semibold ${
							achievement.unlocked ? 'text-violet-700' : 'text-gray-400'
						}`}
					>
						{achievement.unlocked ? 'Отримано' : 'Ще заблоковано'}
					</p>
				</div>
			</div>
		</div>
	)
}
