'use client'

import { useAuth } from '@/contexts/authContext'
import { loginRequest } from '@/lib/api/authApi'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
	const { setSession } = useAuth()
	return useMutation({
		mutationFn: loginRequest,
		onSuccess: (data) => {
			setSession(data)
		}
	})
}
