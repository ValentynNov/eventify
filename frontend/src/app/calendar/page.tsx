import type { Metadata } from 'next'
import { CalendarPageView } from '@/features/calendar/CalendarPageView'

export const metadata: Metadata = {
	title: 'Календар'
}

const CalendarPage = () => (
	<div className='mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-10'>
		<CalendarPageView />
	</div>
)

export default CalendarPage
