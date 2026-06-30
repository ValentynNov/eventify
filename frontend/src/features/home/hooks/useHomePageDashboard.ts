'use client'

import { useAuth } from '@/contexts/authContext'
import { pickUpcomingEvents } from '@/lib/pickUpcomingEvents'
import { useEvents } from '@/queries/useEvents'
import { useRegistrations } from '@/queries/useRegistrations'
import type { EventQueryParams, RegistrationDto } from '@/types/api'
import type { DashboardRegistrationStats } from '@/types/dashboard'
import { useMemo } from 'react'

const MONTH_MS = 30 * 24 * 60 * 60 * 1000

const overviewParams: EventQueryParams = {
	pageNumber: 1,
	pageSize: 100,
	sortBy: 'date',
	sortOrder: 'asc'
}

const registrationListParams = {
	pageNumber: 1,
	pageSize: 100,
	sortBy: 'createdat' as const,
	sortOrder: 'desc' as const
}

const buildRegistrationStats = (
	isHydrated: boolean,
	isAuthenticated: boolean,
	regData: { items: RegistrationDto[]; totalCount: number } | undefined,
	regLoading: boolean
): DashboardRegistrationStats => {
	if (!isHydrated || !isAuthenticated) {
		return {
			total: 0,
			pending: 0,
			approved: 0,
			newInLastMonth: 0,
			pendingOpenedLastMonth: 0,
			approvedLastMonth: 0,
			isLoading: false,
			isGuest: true,
			isPartialSample: false
		}
	}

	if (!regData) {
		return {
			total: 0,
			pending: 0,
			approved: 0,
			newInLastMonth: 0,
			pendingOpenedLastMonth: 0,
			approvedLastMonth: 0,
			isLoading: regLoading,
			isGuest: false,
			isPartialSample: false
		}
	}

	const items = regData.items
	const since = Date.now() - MONTH_MS
	const pending = items.filter((r) => r.status === 'Pending').length
	const approved = items.filter((r) => r.status === 'Approved').length
	const newInLastMonth = items.filter(
		(r) => new Date(r.createdAt).getTime() >= since
	).length
	const pendingOpenedLastMonth = items.filter(
		(r) =>
			r.status === 'Pending' && new Date(r.createdAt).getTime() >= since
	).length
	const approvedLastMonth = items.filter(
		(r) =>
			r.status === 'Approved' && new Date(r.createdAt).getTime() >= since
	).length

	return {
		total: regData.totalCount,
		pending,
		approved,
		newInLastMonth,
		pendingOpenedLastMonth,
		approvedLastMonth,
		isLoading: false,
		isGuest: false,
		isPartialSample: regData.totalCount > items.length
	}
}

export const useHomePageDashboard = () => {
	const { isAuthenticated, isHydrated } = useAuth()

	const { data: aggregate, isLoading: aggregateLoading } =
		useEvents(overviewParams)

	const { data: regData, isLoading: regLoading } =
		useRegistrations(registrationListParams)

	const registrationStats = useMemo(
		() =>
			buildRegistrationStats(
				isHydrated,
				isAuthenticated,
				regData,
				regLoading
			),
		[isAuthenticated, isHydrated, regData, regLoading]
	)

	const heroEvents = useMemo(
		() => pickUpcomingEvents(aggregate?.items ?? [], 5),
		[aggregate?.items]
	)

	const recentRegs = useMemo(
		() => (regData?.items ?? []).slice(0, 6),
		[regData?.items]
	)

	return {
		aggregate,
		aggregateLoading,
		registrationStats,
		heroEvents,
		recentRegs,
		regLoading,
		isAuthenticated,
		isHydrated
	}
}
