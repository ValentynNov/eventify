'use client'

import { fetchEvents } from '@/lib/api/eventsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { EventQueryParams } from '@/types/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

export const useEvents = (params?: EventQueryParams) =>
	useQuery({
		queryKey: queryKeys.events(params),
		queryFn: async () => await fetchEvents(params),
		placeholderData: keepPreviousData
	})
