'use client'

import { Card } from '@/components/core/Card/Card'
import { Skeleton } from '@/components/core/Skeleton/Skeleton'
import { cn } from '@/lib/utils'
import type { EventDto } from '@/types/api'
import type { DashboardRegistrationStats } from '@/types/dashboard'
import { CalendarDays, CheckCircle2, Clock, Users } from 'lucide-react'

const MONTH_MS = 30 * 24 * 60 * 60 * 1000

type Props = {
	items: EventDto[]
	totalEvents: number | undefined
	isLoadingEvents: boolean
	registrations: DashboardRegistrationStats
}

const countCreatedSince = (
	items: { createdAt: string }[],
	since: number
): number =>
	items.filter((x) => new Date(x.createdAt).getTime() >= since).length

const Trend = ({
	delta,
	goodWhenUp = true
}: {
	delta: number
	goodWhenUp?: boolean
}) => {
	if (delta === 0) {
		return (
			<p className='text-xs text-gray-400'>Без змін у вибірці за місяць</p>
		)
	}
	const up = delta > 0
	const positive = goodWhenUp ? up : !up
	return (
		<p
			className={cn(
				'text-xs font-medium',
				positive ? 'text-emerald-600' : 'text-red-600'
			)}
		>
			{up ? '↑' : '↓'} {Math.abs(delta)} за останній місяць
		</p>
	)
}

export const EventStatHeroCards = ({
	items,
	totalEvents,
	isLoadingEvents,
	registrations: regs
}: Props) => {
	if (isLoadingEvents) {
		return (
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				{[0, 1, 2, 3].map((i) => (
					<Skeleton key={i} className='h-32 rounded-2xl' />
				))}
			</div>
		)
	}

	const since = Date.now() - MONTH_MS
	const newEventsInSample = countCreatedSince(items, since)

	const regTotalDisplay = regs.isGuest
		? '—'
		: regs.isLoading
			? '…'
			: regs.total.toString()
	const pendingDisplay = regs.isGuest
		? '—'
		: regs.isLoading
			? '…'
			: regs.pending.toString()
	const approvedDisplay = regs.isGuest
		? '—'
		: regs.isLoading
			? '…'
			: regs.approved.toString()

	const sampleHint = regs.isPartialSample ? (
		<p className='text-[11px] text-gray-400'>
			Частина показників заявок — з поточної вибірки даних.
		</p>
	) : null

	return (
		<div className='space-y-2'>
			{sampleHint}
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<Card className='flex flex-col gap-3 rounded-2xl border-gray-200/80 p-5 shadow-sm'>
					<div className='flex gap-4'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600'>
							<CalendarDays className='h-6 w-6' aria-hidden />
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm text-gray-500'>Всього заходів</p>
							<p className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
								{totalEvents?.toString() ?? '—'}
							</p>
						</div>
					</div>
					<Trend delta={newEventsInSample} />
				</Card>

				<Card className='flex flex-col gap-3 rounded-2xl border-gray-200/80 p-5 shadow-sm'>
					<div className='flex gap-4'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
							<Users className='h-6 w-6' aria-hidden />
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm text-gray-500'>Всього заявок</p>
							<p className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
								{regTotalDisplay}
							</p>
						</div>
					</div>
					{regs.isGuest ? (
						<p className='text-xs text-gray-400'>
							Увійдіть, щоб бачити свої заявки
						</p>
					) : (
						<Trend delta={regs.newInLastMonth} />
					)}
				</Card>

				<Card className='flex flex-col gap-3 rounded-2xl border-gray-200/80 p-5 shadow-sm'>
					<div className='flex gap-4'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600'>
							<Clock className='h-6 w-6' aria-hidden />
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm text-gray-500'>Очікують розгляду</p>
							<p className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
								{pendingDisplay}
							</p>
						</div>
					</div>
					{regs.isGuest ? (
						<p className='text-xs text-gray-400'>Доступно після входу</p>
					) : (
						<Trend delta={regs.pendingOpenedLastMonth} goodWhenUp={false} />
					)}
				</Card>

				<Card className='flex flex-col gap-3 rounded-2xl border-gray-200/80 p-5 shadow-sm'>
					<div className='flex gap-4'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
							<CheckCircle2 className='h-6 w-6' aria-hidden />
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm text-gray-500'>Підтверджені</p>
							<p className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
								{approvedDisplay}
							</p>
						</div>
					</div>
					{regs.isGuest ? (
						<p className='text-xs text-gray-400'>Доступно після входу</p>
					) : (
						<Trend delta={regs.approvedLastMonth} />
					)}
				</Card>
			</div>
		</div>
	)
}
