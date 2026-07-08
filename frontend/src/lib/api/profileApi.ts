import { apiClient } from '@/lib/api/client'
import { normalizeRegistrationDto } from '@/lib/api/normalizers'
import type { UserProfileDto } from '@/types/api'

export const fetchMyProfile = async (): Promise<UserProfileDto> => {
	const { data } = await apiClient.get<UserProfileDto>('/api/profile/me')

	return {
		...data,
		role: data.role,
		favoriteCategories: data.favoriteCategories.map(item => ({
			...item,
			category: item.category.toLowerCase()
		})),
		recentRegistrations: data.recentRegistrations.map(normalizeRegistrationDto)
	}
}

export const updateMyAvatar = async (
	avatarEmoji: string
): Promise<{ avatarEmoji: string }> => {
	const { data } = await apiClient.patch<{ avatarEmoji: string }>(
		'/api/profile/me/avatar',
		{ avatarEmoji }
	)
	return data
}
