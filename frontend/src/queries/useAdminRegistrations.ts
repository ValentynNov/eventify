'use client'

import { fetchAllRegistrations } from '@/lib/api/registrationsApi'
import { queryKeys } from '@/queries/queryKeys'
import { useAuth } from '@/contexts/authContext'
import { isAdminUser } from '@/lib/auth/isAdmin'
import type { AdminRegistrationsQueryParams } from '@/types/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

export const useAdminRegistrations = (params?: AdminRegistrationsQueryParams) => {
	const { user, isHydrated } = useAuth()
	const enabled = isHydrated && isAdminUser(user?.role)

	return useQuery({
		queryKey: queryKeys.adminRegistrations(params),
		queryFn: async () => await fetchAllRegistrations(params),
		enabled,
		placeholderData: keepPreviousData
	})
}
