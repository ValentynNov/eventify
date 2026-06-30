'use client'

import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { useEvents } from '@/queries/useEvents'
import type { EventQueryParams } from '@/types/api'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

type QueryLike = Pick<URLSearchParams, 'get'>

export const EVENT_EXPLORER_SORT_VALUES = [
	'date_asc',
	'date_desc',
	'title_asc',
	'title_desc',
	'nearest',
	'created_desc',
	'created_asc',
	'capacity_desc',
	'capacity_asc',
	'popularity'
] as const

export type EventsExplorerSortToken =
	(typeof EVENT_EXPLORER_SORT_VALUES)[number]

const SORT_SET = new Set<string>(EVENT_EXPLORER_SORT_VALUES)

const ALLOWED_STATUS = new Set(['upcoming', 'ongoing', 'finished'])
const ALLOWED_AVAIL = new Set(['available', 'full', 'spots', 'spots_gt_0'])
const ALLOWED_FORMAT = new Set(['online', 'offline', 'hybrid'])
const ALLOWED_CATEGORY = new Set([
	'conference',
	'meetup',
	'workshop',
	'webinar',
	'hackathon'
])
const ALLOWED_DATE_PRESET = new Set(['today', 'tomorrow', 'week', 'month'])

export function parseSortFromSearchParams(sp: QueryLike): EventsExplorerSortToken {
	const raw = sp.get('sort')
	if (!raw) return 'date_asc'
	const n = raw.trim().toLowerCase().replace(/-/g, '_')
	if (SORT_SET.has(n)) return n as EventsExplorerSortToken
	return 'date_asc'
}

function parsePage(sp: QueryLike): number {
	const n = parseInt(sp.get('page') ?? '1', 10)
	if (!Number.isFinite(n) || n < 1) return 1
	return Math.min(n, 10_000)
}

function parseStatus(sp: QueryLike): string {
	const v = (sp.get('status') ?? '').trim().toLowerCase()
	return ALLOWED_STATUS.has(v) ? v : ''
}

function parseAvailability(sp: QueryLike): string {
	if (sp.get('available') === 'true') return 'available'
	const v = (sp.get('availability') ?? '').trim().toLowerCase()
	if (v === 'spots_gt_0') return 'spots'
	if (ALLOWED_AVAIL.has(v)) return v
	return ''
}

function parseFormat(sp: QueryLike): string {
	const v = (sp.get('format') ?? '').trim().toLowerCase()
	return ALLOWED_FORMAT.has(v) ? v : ''
}

function parseCategory(sp: QueryLike): string {
	const v = (sp.get('category') ?? '').trim().toLowerCase()
	return ALLOWED_CATEGORY.has(v) ? v : ''
}

function parseDatePreset(sp: QueryLike): string {
	const v = (sp.get('datePreset') ?? '').trim().toLowerCase()
	return ALLOWED_DATE_PRESET.has(v) ? v : ''
}

function sortToApiParams(
	sort: EventsExplorerSortToken
): Pick<EventQueryParams, 'sortBy' | 'sortOrder'> {
	switch (sort) {
		case 'date_asc':
			return { sortBy: 'date', sortOrder: 'asc' }
		case 'date_desc':
			return { sortBy: 'date', sortOrder: 'desc' }
		case 'title_asc':
			return { sortBy: 'title', sortOrder: 'asc' }
		case 'title_desc':
			return { sortBy: 'title', sortOrder: 'desc' }
		case 'created_desc':
			return { sortBy: 'createdat', sortOrder: 'desc' }
		case 'created_asc':
			return { sortBy: 'createdat', sortOrder: 'asc' }
		case 'capacity_desc':
			return { sortBy: 'capacity', sortOrder: 'desc' }
		case 'capacity_asc':
			return { sortBy: 'capacity', sortOrder: 'asc' }
		case 'popularity':
			return { sortBy: 'popularity', sortOrder: 'desc' }
		case 'nearest':
			return { sortBy: 'nearest', sortOrder: 'asc' }
		default:
			return { sortBy: 'date', sortOrder: 'asc' }
	}
}

type Args = {
	pageSize: number
}

export const useEventsExplorerState = ({ pageSize }: Args) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const urlSearch = searchParams.get('search') ?? ''
	const urlLocation = searchParams.get('location') ?? ''

	const [searchDraft, setSearchDraft] = useState(urlSearch)
	const [locationDraft, setLocationDraft] = useState(urlLocation)

	const debouncedSearch = useDebouncedValue(searchDraft, 350)
	const debouncedLocation = useDebouncedValue(locationDraft, 350)

	useEffect(() => {
		setSearchDraft(urlSearch)
	}, [urlSearch])

	useEffect(() => {
		setLocationDraft(urlLocation)
	}, [urlLocation])

	const replaceFromParams = useCallback(
		(next: URLSearchParams) => {
			const qs = next.toString()
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
		},
		[pathname, router]
	)

	useEffect(() => {
		const target = debouncedSearch.trim()
		const current = searchParams.get('search') ?? ''
		if (target === current) return
		const p = new URLSearchParams(searchParams.toString())
		if (target) p.set('search', target)
		else p.delete('search')
		p.delete('page')
		replaceFromParams(p)
	}, [debouncedSearch, replaceFromParams, searchParams])

	useEffect(() => {
		const target = debouncedLocation.trim()
		const current = searchParams.get('location') ?? ''
		if (target === current) return
		const p = new URLSearchParams(searchParams.toString())
		if (target) p.set('location', target)
		else p.delete('location')
		p.delete('page')
		replaceFromParams(p)
	}, [debouncedLocation, replaceFromParams, searchParams])

	const searchParamString = searchParams.toString()

	const queryParams = useMemo((): EventQueryParams => {
		const sp = new URLSearchParams(searchParamString)
		const sort = parseSortFromSearchParams(sp)
		const availability = parseAvailability(sp)
		return {
			pageNumber: parsePage(sp),
			pageSize,
			search: (sp.get('search') ?? '').trim() || undefined,
			location: (sp.get('location') ?? '').trim() || undefined,
			status: parseStatus(sp) || undefined,
			availability: availability || undefined,
			format: parseFormat(sp) || undefined,
			category: parseCategory(sp) || undefined,
			datePreset: parseDatePreset(sp) || undefined,
			...sortToApiParams(sort)
		}
	}, [pageSize, searchParamString])

	const {
		data,
		isLoading,
		error,
		refetch,
		isFetching
	} = useEvents(queryParams)

	const patchUrl = useCallback(
		(mutate: (p: URLSearchParams) => void) => {
			const p = new URLSearchParams(searchParams.toString())
			mutate(p)
			p.delete('page')
			replaceFromParams(p)
		},
		[replaceFromParams, searchParams]
	)

	const setSort = useCallback(
		(next: EventsExplorerSortToken) => {
			patchUrl((p) => {
				if (next === 'date_asc') p.delete('sort')
				else p.set('sort', next)
			})
		},
		[patchUrl]
	)

	const setStatus = useCallback(
		(v: string) => {
			patchUrl((p) => {
				if (!v) p.delete('status')
				else p.set('status', v)
			})
		},
		[patchUrl]
	)

	const setAvailability = useCallback(
		(v: string) => {
			patchUrl((p) => {
				p.delete('available')
				if (!v) p.delete('availability')
				else if (v === 'available') {
					p.set('available', 'true')
					p.delete('availability')
				} else p.set('availability', v)
			})
		},
		[patchUrl]
	)

	const setFormat = useCallback(
		(v: string) => {
			patchUrl((p) => {
				if (!v) p.delete('format')
				else p.set('format', v)
			})
		},
		[patchUrl]
	)

	const setCategory = useCallback(
		(v: string) => {
			patchUrl((p) => {
				if (!v) p.delete('category')
				else p.set('category', v)
			})
		},
		[patchUrl]
	)

	const setDatePreset = useCallback(
		(v: string) => {
			patchUrl((p) => {
				if (!v) p.delete('datePreset')
				else p.set('datePreset', v)
			})
		},
		[patchUrl]
	)

	const setPage = useCallback(
		(updater: (prev: number) => number) => {
			const p = new URLSearchParams(searchParams.toString())
			const current = parsePage(p)
			const next = updater(current)
			if (next <= 1) p.delete('page')
			else p.set('page', String(next))
			replaceFromParams(p)
		},
		[replaceFromParams, searchParams]
	)

	const resetFilters = useCallback(() => {
		router.replace(pathname, { scroll: false })
		setSearchDraft('')
		setLocationDraft('')
	}, [pathname, router])

	const sort = parseSortFromSearchParams(searchParams)
	const page = parsePage(searchParams)
	const status = parseStatus(searchParams)
	const availability = parseAvailability(searchParams)
	const format = parseFormat(searchParams)
	const category = parseCategory(searchParams)
	const datePreset = parseDatePreset(searchParams)

	const hasActiveFilters = Boolean(
		(searchParams.get('search') ?? '').trim() ||
			(searchParams.get('location') ?? '').trim() ||
			status ||
			availability ||
			format ||
			category ||
			datePreset ||
			(searchParams.get('sort') ?? '').trim()
	)

	return {
		search: searchDraft,
		onSearchChange: setSearchDraft,
		location: locationDraft,
		onLocationChange: setLocationDraft,
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
		skeletonSlots: Math.min(pageSize, 6),
		data,
		isLoading,
		isFetching,
		error,
		refetch
	}
}
