'use client'

import { createEvent, type CreateEventPayload } from '@/lib/api/eventsApi'
import { queryKeys } from '@/queries/queryKeys'
import type { EventDto } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateEvent = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (payload: CreateEventPayload) => await createEvent(payload),
		onSuccess: (created: EventDto) => {
			qc.invalidateQueries({ queryKey: ['events'] })
			qc.invalidateQueries({ queryKey: queryKeys.event(created.id) })
			qc.invalidateQueries({ queryKey: ['registrations', 'admin'] })
		}
	})
}
