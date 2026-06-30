import type { Metadata } from 'next'
import { Suspense } from 'react'

import { EventsRouteView } from '@/features/events/EventsRouteView'
import { Loader } from '@/components/core/Loader/Loader'

export const metadata: Metadata = {
	title: 'Події'
}

const EventsPage = () => (
	<div className='mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-10'>
		<header className='mb-8 space-y-2 sm:mb-10'>
			<h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
				Каталог подій
			</h1>
			<p className='max-w-2xl text-sm text-gray-500 sm:text-base'>
				Живий список із пошуком і сортуванням. Оберіть подію, щоб відкрити сторінку
				з деталями та реєстрацією.
			</p>
		</header>

		<Suspense
			fallback={
				<div className='flex justify-center py-24'>
					<Loader />
				</div>
			}
		>
			<EventsRouteView />
		</Suspense>
	</div>
)

export default EventsPage
