export type EventDto = {
	id: string
	title: string
	description: string
	date: string
	eventDate?: string
	location: string
	capacity: number
	createdAt: string
	category: string
	format: string
	approvedRegistrationCount: number
}

export type RegistrationStatusDto = 'Pending' | 'Approved' | 'Rejected'
export type ApiRegistrationStatusDto = 'PENDING' | 'APPROVED' | 'REJECTED'

export type RegistrationDto = {
	id: string
	userId?: string
	username?: string
	email?: string
	eventId: string
	eventTitle: string
	eventCategory?: string
	eventFormat?: string
	location?: string
	capacity?: number
	eventDate?: string
	status: RegistrationStatusDto
	createdAt: string
	updatedAt?: string
	event?: EventDto
}

export type RegistrationStreakDto = {
	days: number
	lastRegistrationAt?: string | null
}

export type AuthUserDto = {
	id?: string
	firebaseUid?: string
	username: string
	email: string
	role: string
}

export type CurrentUserDto = AuthUserDto
export type AuthResponseDto = AuthUserDto

export type PagedResponse<T> = {
	items: T[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
	hasNext?: boolean
	hasPrevious?: boolean
}

export type EventQueryParams = {
	pageNumber?: number
	pageSize?: number
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
	search?: string
	location?: string
	status?: string
	availability?: string
	format?: string
	category?: string
	datePreset?: string
}

export type RegistrationsQueryParams = {
	pageNumber?: number
	pageSize?: number
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export type AdminRegistrationsQueryParams = RegistrationsQueryParams & {
	eventId?: string
	status?: RegistrationStatusDto
}

export type AchievementDto = {
	title: string
	description: string
	unlocked: boolean
}

export type FavoriteCategoryDto = {
	category: string
	count: number
}

export type UserProfileDto = AuthUserDto & {
	avatarEmoji: string | null
	totalRegistrationCount: number
	approvedRegistrationCount: number
	pendingRegistrationCount: number
	rejectedRegistrationCount: number
	streakDays: number
	favoriteCategories: FavoriteCategoryDto[]
	recentRegistrations: RegistrationDto[]
	achievements: AchievementDto[]
}
