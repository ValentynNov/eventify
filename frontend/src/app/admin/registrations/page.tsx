import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loader } from '@/components/core/Loader/Loader'
import { AdminRegistrationsPageView } from '@/features/admin/AdminRegistrationsPageView'

export const metadata: Metadata = {
	title: 'Модерація заявок'
}

const AdminRegistrationsPage = () => (
	<Suspense
		fallback={
			<div className='flex min-h-[40vh] items-center justify-center px-4'>
				<Loader label='Завантаження…' />
			</div>
		}
	>
		<AdminRegistrationsPageView />
	</Suspense>
)

export default AdminRegistrationsPage
