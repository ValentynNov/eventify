import type {
	AdminRegistrationsQueryParams,
	EventQueryParams,
	RegistrationsQueryParams
} from '@/types/api'

export const queryKeys = {
	events: (params?: EventQueryParams) => ['events', params] as const,
	event: (id: string) => ['events', id] as const,
	registrations: (params?: RegistrationsQueryParams) =>
		['registrations', 'me', params] as const,
	registrationStreak: () => ['registrations', 'me', 'streak'] as const,
	adminRegistrations: (params?: AdminRegistrationsQueryParams) =>
		['registrations', 'admin', params] as const
}
