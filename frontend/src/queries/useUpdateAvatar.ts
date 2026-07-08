'use client'

import { updateMyAvatar } from '@/lib/api/profileApi'
import { queryKeys } from '@/queries/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateAvatar = () => {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: updateMyAvatar,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.profile() })
		}
	})
}
