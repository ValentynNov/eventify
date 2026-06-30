'use client'

import { useAuth } from '@/contexts/authContext'
import { fetchMyRegistrationStreak } from '@/lib/api/registrationsApi'
import { queryKeys } from '@/queries/queryKeys'
import { useQuery } from '@tanstack/react-query'

export const useRegistrationStreak = () => {
	const { isAuthenticated, isHydrated } = useAuth()

	return useQuery({
		queryKey: queryKeys.registrationStreak(),
		queryFn: fetchMyRegistrationStreak,
		enabled: isHydrated && isAuthenticated,
		staleTime: 60_000
	})
}
