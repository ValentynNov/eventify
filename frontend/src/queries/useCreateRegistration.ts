'use client'

import { createRegistration } from '@/lib/api/registrationsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { RegistrationDto } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateRegistration = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (eventId: string) => await createRegistration(eventId),
		onSuccess: (created: RegistrationDto) => {
			qc.invalidateQueries({ queryKey: ['registrations', 'me'] })
			qc.invalidateQueries({ queryKey: queryKeys.registrationStreak() })
			qc.invalidateQueries({
				queryKey: queryKeys.event(created.eventId)
			})
			qc.invalidateQueries({ queryKey: ['events'] })
		}
	})
}
