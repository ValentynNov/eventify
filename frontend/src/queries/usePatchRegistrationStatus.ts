'use client'

import { patchRegistrationStatus } from '@/lib/api/registrationsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { RegistrationDto, RegistrationStatusDto } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const usePatchRegistrationStatus = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async ({
			registrationId,
			status
		}: {
			registrationId: string
			status: RegistrationStatusDto
		}) => await patchRegistrationStatus(registrationId, status),
		onSuccess: async (updated: RegistrationDto) => {
			await Promise.all([
				qc.invalidateQueries({ queryKey: ['registrations', 'admin'] }),
				qc.invalidateQueries({ queryKey: ['registrations', 'me'] }),
				qc.invalidateQueries({
					queryKey: queryKeys.event(updated.eventId),
					exact: true
				}),
				qc.invalidateQueries({ queryKey: ['events'] })
			])
			await qc.refetchQueries({
				queryKey: queryKeys.event(updated.eventId),
				exact: true,
				type: 'all'
			})
		}
	})
}
