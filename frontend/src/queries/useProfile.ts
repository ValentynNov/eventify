'use client'

import { useAuth } from '@/contexts/authContext'
import { fetchMyProfile } from '@/lib/api/profileApi'
import { queryKeys } from '@/queries/queryKeys'
import { useQuery } from '@tanstack/react-query'

export const useProfile = () => {
	const { isAuthenticated, isHydrated } = useAuth()

	return useQuery({
		queryKey: queryKeys.profile(),
		queryFn: fetchMyProfile,
		enabled: isHydrated && isAuthenticated,
		staleTime: 30_000
	})
}
