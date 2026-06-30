import { isAxiosError } from 'axios'

export const extractApiMessage = (
	error: unknown,
	fallback = 'Сталася помилка'
): string => {
	if (isAxiosError(error)) {
		const raw = error.response?.data as { message?: unknown } | undefined
		if (typeof raw?.message === 'string' && raw.message.trim())
			return raw.message
	}
	if (error instanceof Error && error.message) return error.message
	return fallback
}
