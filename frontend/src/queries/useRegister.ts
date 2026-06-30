'use client'

import { useAuth } from '@/contexts/authContext'
import { registerRequest } from '@/lib/api/authApi'
import { useMutation } from '@tanstack/react-query'

export const useRegister = () => {
	const { setSession } = useAuth()
	return useMutation({
		mutationFn: registerRequest,
		onSuccess: (data) => {
			setSession(data)
		}
	})
}
