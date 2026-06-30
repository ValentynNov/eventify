import type { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { type ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Реєстрації'
}

const RegistrationsLayout = ({ children }: { children: ReactNode }) => (
	<ProtectedRoute>{children}</ProtectedRoute>
)

export default RegistrationsLayout
