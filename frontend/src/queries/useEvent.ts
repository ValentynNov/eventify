'use client'

import { fetchEventById } from '@/lib/api/eventsApi'
import { queryKeys } from '@/queries/queryKeys'
import { useQuery } from '@tanstack/react-query'

export const useEvent = (id: string | null) =>
	useQuery({
		queryKey: queryKeys.event(id ?? 'unknown'),
		queryFn: async () => await fetchEventById(id!),
		enabled: Boolean(id)
	})
