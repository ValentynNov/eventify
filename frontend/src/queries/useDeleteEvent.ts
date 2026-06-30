'use client'

import { deleteEvent } from '@/lib/api/eventsApi'
import { queryKeys } from '@/queries/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteEvent = () => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (id: string) => {
			await deleteEvent(id)
			return id
		},
		onSuccess: (id) => {
			qc.removeQueries({ queryKey: queryKeys.event(id) })
			qc.invalidateQueries({ queryKey: ['events'] })
			qc.invalidateQueries({ queryKey: ['registrations'] })
			qc.invalidateQueries({ queryKey: ['registrations', 'admin'] })
		}
	})
}
