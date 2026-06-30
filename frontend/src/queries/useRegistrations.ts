'use client'

import { useAuth } from '@/contexts/authContext'
import { fetchMyRegistrations } from '@/lib/api/registrationsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { RegistrationsQueryParams } from '@/types/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

export const useRegistrations = (params?: RegistrationsQueryParams) => {
	const { isAuthenticated, isHydrated } = useAuth()
	return useQuery({
		queryKey: queryKeys.registrations(params),
		queryFn: async () => await fetchMyRegistrations(params),
		enabled: isHydrated && isAuthenticated,
		placeholderData: keepPreviousData
	})
}
