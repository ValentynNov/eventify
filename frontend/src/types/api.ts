export type EventDto = {
	id: string
	title: string
	description: string
	date: string
	location: string
	capacity: number
	createdAt: string
	category: string
	format: string
	approvedRegistrationCount: number
}

export type RegistrationStatusDto = 'Pending' | 'Approved' | 'Rejected'

export type RegistrationDto = {
	id: string
	userId: string
	username: string
	eventId: string
	eventTitle: string
	eventCategory?: string
	eventFormat?: string
	status: RegistrationStatusDto
	createdAt: string
}

export type RegistrationStreakDto = {
	days: number
	lastRegistrationAt: string | null
}

export type AuthUserDto = {
	username: string
	email: string
	role: string
}

export type AuthResponseDto = AuthUserDto & {
	token: string
	refreshToken: string
	expiresAt: string
	refreshTokenExpiresAt: string
}

export type PagedResponse<T> = {
	items: T[]
	pageNumber: number
	pageSize: number
	totalCount: number
	totalPages: number
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
