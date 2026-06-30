'use client'

import { Button } from '@/components/core/Button/Button'
import { EmptyState } from '@/components/core/EmptyState/EmptyState'
import { SearchInput } from '@/components/core/SearchInput/SearchInput'
import { Select, type SelectOption } from '@/components/core/Select/Select'
import { Skeleton } from '@/components/core/Skeleton/Skeleton'
import { Input } from '@/components/core/Input/Input'
import { EventCard } from '@/features/events/components/EventCard'
import { EventsPagination } from '@/features/events/components/EventsPagination'
import {
	EVENT_CATEGORY_OPTIONS,
	EVENT_FORMAT_OPTIONS
} from '@/features/events/constants/eventTaxonomy'
import {
	useEventsExplorerState,
	type EventsExplorerSortToken
} from '@/features/events/hooks/useEventsExplorerState'
import { extractApiMessage } from '@/lib/apiError'
import { CalendarOff, Filter, RotateCcw } from 'lucide-react'
import Link from 'next/link'

const SORT_OPTIONS: SelectOption[] = [
	{ value: 'date_asc', label: 'Дата: найраніші' },
	{ value: 'date_desc', label: 'Дата: найпізніші' },
	{ value: 'nearest', label: 'Найближчі події' },
	{ value: 'title_asc', label: 'Назва: А→Я' },
	{ value: 'title_desc', label: 'Назва: Я→А' },
	{ value: 'created_desc', label: 'Найновіші додані' },
	{ value: 'created_asc', label: 'Найстаріші додані' },
	{ value: 'capacity_desc', label: 'Найбільша кількість місць' },
	{ value: 'capacity_asc', label: 'Найменша кількість місць' },
	{ value: 'popularity', label: 'Найпопулярніші (за реєстраціями)' }
]

const STATUS_OPTIONS: SelectOption[] = [
	{ value: 'upcoming', label: 'Майбутні' },
	{ value: 'ongoing', label: 'Тривають зараз' },
	{ value: 'finished', label: 'Завершені' }
]

const AVAILABILITY_OPTIONS: SelectOption[] = [
	{ value: 'available', label: 'Лише з вільними місцями' },
	{ value: 'full', label: 'Повністю заповнені' },
	{ value: 'spots', label: 'Є вільні місця (spots)' }
]

const DATE_PRESET_OPTIONS: SelectOption[] = [
	{ value: 'today', label: 'Сьогодні' },
	{ value: 'tomorrow', label: 'Завтра' },
	{ value: 'week', label: 'Цього тижня' },
	{ value: 'month', label: 'Цього місяця' }
]

type Props = {
	pageSize?: number
	compactEmpty?: boolean
	showPagination?: boolean
}

export const EventsExplorer = ({
	pageSize = 9,
	compactEmpty,
	showPagination = true
}: Props) => {
	const {
		search,
		onSearchChange,
		location,
		onLocationChange,
		sort,
		setSort,
		status,
		setStatus,
		availability,
		setAvailability,
		format,
		setFormat,
		category,
		setCategory,
		datePreset,
		setDatePreset,
		page,
		setPage,
		resetFilters,
		hasActiveFilters,
		skeletonSlots,
		data,
		isLoading,
		error,
		refetch
	} = useEventsExplorerState({ pageSize })

	const availabilityValue =
		availability === 'spots_gt_0' ? 'spots' : availability

	return (
		<div className='space-y-6'>
			<div className='space-y-4'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
					<div className='w-full min-w-0 flex-1'>
						<label
							htmlFor='event-search'
							className='sr-only'
						>
							Пошук подій
						</label>
						<SearchInput
							id='event-search'
							value={search}
							onChange={e => onSearchChange(e.target.value)}
							placeholder='Шукати за назвою чи описом…'
						/>
					</div>
					<div className='w-full shrink-0 sm:max-w-55'>
						<label
							htmlFor='event-location'
							className='sr-only'
						>
							Локація або місто
						</label>
						<Input
							id='event-location'
							value={location}
							onChange={e => onLocationChange(e.target.value)}
							placeholder='Місто / локація…'
							className='rounded-xl py-3'
						/>
					</div>
				</div>

				<div className='rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm sm:p-5'>
					<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
						<div className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
							<Filter
								className='h-4 w-4 text-purple-600'
								aria-hidden
							/>
							Фільтри та сортування
						</div>
						{hasActiveFilters || page > 1 ? (
							<Button
								type='button'
								variant='secondary'
								className='h-9 gap-2 px-3 text-xs sm:text-sm'
								onClick={resetFilters}
							>
								<RotateCcw
									className='h-3.5 w-3.5'
									aria-hidden
								/>
								Скинути
							</Button>
						) : null}
					</div>

					<div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6'>
						<div className='min-w-0 shrink-0 lg:w-56 xl:w-64'>
							<Select
								id='event-sort'
								label='Сортування'
								allowEmpty={false}
								value={sort}
								onChange={e =>
									setSort(e.target.value as EventsExplorerSortToken)
								}
								options={SORT_OPTIONS}
							/>
						</div>

						<div className='min-h-0 min-w-0 flex-1'>
							<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden'>
								Фільтри
							</p>
							<div className='flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden'>
								<div className='min-w-39.5 shrink-0 lg:min-w-0'>
									<Select
										id='event-status'
										label='Статус події'
										value={status}
										onChange={e => setStatus(e.target.value)}
										options={STATUS_OPTIONS}
									/>
								</div>
								<div className='min-w-39.5 shrink-0 lg:min-w-0'>
									<Select
										id='event-availability'
										label='Місця'
										value={availabilityValue}
										onChange={e => setAvailability(e.target.value)}
										options={AVAILABILITY_OPTIONS}
									/>
								</div>
								<div className='min-w-39.5 shrink-0 lg:min-w-0'>
									<Select
										id='event-format'
										label='Формат'
										value={format}
										onChange={e => setFormat(e.target.value)}
										options={EVENT_FORMAT_OPTIONS}
									/>
								</div>
								<div className='min-w-39.5 shrink-0 lg:min-w-0'>
									<Select
										id='event-category'
										label='Категорія'
										value={category}
										onChange={e => setCategory(e.target.value)}
										options={EVENT_CATEGORY_OPTIONS}
									/>
								</div>
								<div className='min-w-39.5 shrink-0 lg:min-w-0'>
									<Select
										id='event-date-preset'
										label='Дата'
										value={datePreset}
										onChange={e => setDatePreset(e.target.value)}
										options={DATE_PRESET_OPTIONS}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{error ? (
				<p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
					Не вдалося завантажити події ({extractApiMessage(error)}).
					<button
						type='button'
						className='mt-3 block font-semibold text-purple-700 underline'
						onClick={() => refetch()}
					>
						Спробувати знову
					</button>
				</p>
			) : null}

			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
				{isLoading
					? Array.from({ length: skeletonSlots }).map((_, i) => (
							<Skeleton
								key={i}
								className='h-56 rounded-xl'
							/>
						))
					: data?.items?.map(ev => (
							<EventCard
								key={ev.id}
								event={ev}
							/>
						))}
			</div>

			{!isLoading && !data?.items?.length ? (
				compactEmpty ? null : (
					<EmptyState
						icon={CalendarOff}
						title='Нічого не знайдено'
						description='Спробуйте змінити фільтри або пошуковий запит.'
						action={<Link href='/events'>Усі події</Link>}
					/>
				)
			) : null}

			{showPagination ? (
				<EventsPagination
					page={data?.pageNumber ?? page}
					totalPages={data?.totalPages ?? 1}
					onPrev={() => setPage(p => Math.max(1, p - 1))}
					onNext={() =>
						setPage(p =>
							data?.totalPages ? Math.min(data.totalPages, p + 1) : p + 1
						)
					}
					isDisabled={isLoading}
				/>
			) : null}
		</div>
	)
}
