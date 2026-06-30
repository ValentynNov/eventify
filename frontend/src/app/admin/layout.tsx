import type { Metadata } from 'next'

import { AdminRoute } from '@/components/auth/AdminRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { type ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Адміністратор'
}

const AdminLayout = ({ children }: { children: ReactNode }) => (
	<ProtectedRoute>
		<AdminRoute>{children}</AdminRoute>
	</ProtectedRoute>
)

export default AdminLayout
