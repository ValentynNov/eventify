export const isAdminUser = (role: string | undefined): boolean =>
	role?.toUpperCase() === 'ADMIN'
