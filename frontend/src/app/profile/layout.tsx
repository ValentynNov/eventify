import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Профіль'
}

const ProfileLayout = ({ children }: { children: ReactNode }) => (
	<ProtectedRoute>{children}</ProtectedRoute>
)

export default ProfileLayout
