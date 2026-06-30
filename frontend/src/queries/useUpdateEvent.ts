'use client'

import { updateEvent, type CreateEventPayload } from '@/lib/api/eventsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { EventDto } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateEvent = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async ({
			id,
			payload
		}: {
			id: string
			payload: CreateEventPayload
		}) => await updateEvent(id, payload),
		onSuccess: (ev: EventDto) => {
			qc.invalidateQueries({ queryKey: ['events'] })
			qc.invalidateQueries({ queryKey: queryKeys.event(ev.id) })
			qc.invalidateQueries({ queryKey: ['registrations', 'admin'] })
		}
	})
}
